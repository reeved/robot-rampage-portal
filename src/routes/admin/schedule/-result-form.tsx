import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Event, type Match, type Participant, type QualifyingMatch, QualifyingMatchSchema } from "@/db";
import { dbMiddleware } from "@/middleware";

const MatchWinnerSchema = QualifyingMatchSchema.pick({ winner: true });
type MatchResult = z.infer<typeof MatchWinnerSchema>;

const sumArr = (arr: number[]) => {
	return arr.reduce((acc, val) => acc + val, 0);
};

const UpdateSchema = z.object({
	scheduleId: z.string(),
	matchId: z.string(),
	winner: MatchWinnerSchema.shape.winner,
});

const getUpdatedRankings = (matches: QualifyingMatch[], participants: Participant[]) => {
	const participantResults: Event["qualifyingResults"] = {};

	for (const participant of participants) {
		participantResults[participant.id] = {
			wins: 0,
			losses: 0,
			winsByKO: 0,
			winsByJD: 0,
			winsByNS: 0,
			lossesByKO: 0,
			lossesByJD: 0,
			lossesByNS: 0,
			opponentIds: [],
			opponentWins: 0,
			score: 0,
		};
	}

	const matchesWithoutExhibition = matches.filter((match) => {
		const matchParticipants = match.participants.map((p) => participants.find((part) => part.id === p.id));
		return !matchParticipants.some((p) => !p || p?.type === "HEAVYWEIGHT");
	});

	for (const match of matchesWithoutExhibition) {
		const winner = match.winner?.id;
		const condition = match.winner?.condition;

		for (const participant of match.participants) {
			const participantId = participant.id;
			if (!participantId) {
				continue;
			}

			participantResults[participantId].opponentIds.push(
				match.participants.filter((p) => p.id !== participantId)[0].id ?? "",
			);

			if (winner !== participantId) {
				participantResults[participantId].losses += 1;
				participantResults[participantId].opponentWins += 1;

				if (condition) {
					participantResults[participantId][`lossesBy${condition}`] += 1;
				}
			} else {
				participantResults[participantId].wins += 1;
				participantResults[participantId].opponentWins += 1;
				if (condition) {
					participantResults[participantId][`winsBy${condition}`] += 1;
				}
			}
		}
	}

	for (const participant of participants) {
		const results = participantResults[participant.id];
		const opponentWins = sumArr(results.opponentIds.map((id) => participantResults[id]?.wins ?? 0));

		participantResults[participant.id].opponentWins = opponentWins;

		// sort by wins
		// then wins by ko
		// then losses by NS (lower is better)
		// then losses by KO (lower is better)
		// then losses by JD (lower is better)
		// then sum of opponent wins

		const score =
			(results.wins * 1000000 +
				results.winsByKO * 100000 +
				-results.lossesByNS * 10000 + // Negative so lower = better
				-results.lossesByKO * 1000 + // Negative so lower = better
				-results.lossesByJD * 100 + // Negative so lower = better
				opponentWins * 10) /
			1000000;

		participantResults[participant.id] = {
			...results,
			score,
		};
	}

	const participantsData = Object.entries(participantResults);
	const aliveParticipants = participantsData
		.filter(([id]) => !participants.find((p) => p.id === id)?.isDead)
		.sort(([, a], [, b]) => {
			return b.score - a.score;
		});
	const deadParticipants = participantsData
		.filter(([id]) => participants.find((p) => p.id === id)?.isDead)
		.sort(([, a], [, b]) => {
			return b.score - a.score;
		});

	console.log(
		"DEAD",
		deadParticipants.map(([id], index) => `${index + 1} ${participants.find((p) => p.id === id)?.name}`),
	);

	return { participantResults, sortedRankings: [...aliveParticipants, ...deadParticipants] };
};

const updateMatchResult = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(UpdateSchema)
	.handler(async ({ data, context }) => {
		const schedule = await context.db.schedule.findOne(({ id }) => id === data.scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		const existingMatch = schedule.matches.find((match) => match.id === data.matchId);

		if (!existingMatch) {
			throw new Error("Match not found");
		}

		const updatedMatches = schedule.matches.map((match) => {
			if (match.id === data.matchId) {
				return {
					...match,
					winner: data.winner,
				};
			}
			return match;
		});

		await context.db.schedule.updateOne(({ id }) => id === data.scheduleId, {
			matches: updatedMatches,
		});

		if (schedule.type !== "QUALIFYING") {
			return;
		}

		// Update rankings after a qualifying match result

		const participants = (await context.db.participants.find(() => true)).filter(
			(participant) => participant.type === "FEATHERWEIGHT",
		);

		const matchParticipants = existingMatch.participants.map((p) => participants.find((part) => part.id === p.id));

		if (matchParticipants.some((p) => p?.type !== "FEATHERWEIGHT")) {
			return;
		}

		const allSchedules = await context.db.schedule.find(() => true);
		const allMatches: QualifyingMatch[] = allSchedules
			.filter((schedule) => schedule.type === "QUALIFYING")
			.flatMap((schedule) => schedule.matches)
			.filter((match) => !!match.winner?.id);

		const { sortedRankings, participantResults } = getUpdatedRankings(allMatches, participants);

		console.log(sortedRankings.map(([id], index) => `${index + 1} ${participants.find((p) => p.id === id)?.name}`));

		await context.db.events.updateOne((e) => e.id === "may", {
			qualifyingResults: participantResults,
			qualifyingRankings: sortedRankings.map(([id], index) => ({
				id,
				position: index + 1,
			})),
		});

		return true;
	});

type Props = {
	scheduleId: string;
	match: Match;
	participants: Participant[];
};

export const ResultForm = ({ scheduleId, match, participants }: Props) => {
	const router = useRouter();
	const form = useForm<MatchResult>({
		defaultValues: { winner: match.winner },
		resolver: zodResolver(MatchWinnerSchema),
	});

	const matchParticipants = match.participants
		.map((p) => participants.find((part) => part.id === p.id))
		.filter(Boolean) as Participant[];

	const onSubmit = async () => {
		const { winner } = form.getValues();

		await updateMatchResult({
			data: {
				scheduleId,
				matchId: match.id,
				winner,
			},
		});
		router.invalidate();

		toast.success("Match winner updated");
	};

	const clearResult = async () => {
		await updateMatchResult({
			data: {
				scheduleId,
				matchId: match.id,
				winner: undefined,
			},
		});
		router.invalidate();

		toast.success("Match result cleared");
	};

	if (!matchParticipants.length) {
		return null;
	}

	return (
		<Form {...form}>
			<form className="p-6 gap-y-6 flex flex-col items-start w-full bg-zinc-900 rounded-md shadow-lg">
				<div className="flex items-center justify-between w-full">
					<h2 className="text-lg font-bold text-white mb-2">UPDATE RESULT</h2>
					<Button type="button" onClick={clearResult} variant="default" className="font-bold">
						<Trash2 className="size-4" />
						CLEAR
					</Button>
				</div>

				<div className="flex gap-4">
					<div className="flex flex-col gap-4">
						<FormField
							name="winner.id"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">Winner</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select winner" />
											</SelectTrigger>
											<SelectContent className="bg-zinc-800 text-white">
												{matchParticipants.map((part) => (
													<SelectItem key={part.id} value={part.id} className="font-bold">
														{part.name}
													</SelectItem>
												))}
											</SelectContent>
										</Select>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name="winner.condition"
							control={form.control}
							render={({ field }) => (
								<FormItem className="flex flex-col items-start">
									<FormLabel className="text-white">Win condition</FormLabel>
									<div className="flex gap-2 mt-1">
										{["KO", "JD", "NS"].map((cond) => (
											<Button
												key={cond}
												variant={field.value === cond ? "secondary" : "outline"}
												className="px-4 py-1 font-bold"
												onClick={() => field.onChange(cond)}
												type="button"
											>
												{cond}
											</Button>
										))}
									</div>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button type="button" onClick={onSubmit} variant="default" className="w-full mt-6 py-3 text-lg font-bold">
					SAVE
				</Button>
			</form>
		</Form>
	);
};
