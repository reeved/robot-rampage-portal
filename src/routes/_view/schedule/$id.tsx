import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Participant, Schedule } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { TrophyIcon, UserIcon } from "lucide-react";
import { z } from "zod";
import { MatchPreview } from "./-match-preview";

const getParticipantRankings = (
	schedule: Schedule,
	participant: Participant[],
) => {
	const allMatches = schedule.matches;

	// const participantsWithScores = participant
};

// Reuse the same server function as admin but without directly importing it
const getScheduleData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const schedule = await context.db.schedule.findOne((p) => p.id === id);
		const participants = await context.db.participants.find(() => true);
		const evt = await context.db.events.findOne((e) => e.id === "may");

		if (!schedule) {
			throw redirect({ to: "/schedule" });
		}

		return { schedule, participants, currentMatchId: evt?.currentMatchId };
	});

export const Route = createFileRoute("/_view/schedule/$id")({
	component: RouteComponent,
	loader: async ({ params }) => getScheduleData({ data: params.id }),
});

function RouteComponent() {
	const { schedule, participants, currentMatchId } = Route.useLoaderData();

	// Calculate the number of wins for each participant to rank them
	const participantScores = participants
		.map((participant) => {
			// Count how many matches the participant has won
			const wins = schedule.matches.filter(
				(match) => match.winner?.id === participant.id,
			).length;

			return {
				...participant,
				score: wins,
			};
		})
		.sort((a, b) => b.score - a.score); // Sort by score descending

	return (
		<div className="w-8/12 mx-auto p-4 ">
			<h1 className="text-3xl font-bold mb-6">{schedule.name}</h1>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-20">
				{/* Left side: Score Tracker */}
				<div className="md:col-span-1">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<TrophyIcon className="h-5 w-5" />
								Participant Rankings
							</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-1">
								{participantScores.map((participant, index) => (
									<div
										key={participant.id}
										className="flex justify-between items-center py-2 border-b last:border-0"
									>
										<div className="flex items-center gap-2">
											<Badge className="w-6 h-6 flex items-center justify-center rounded-full">
												{index + 1}
											</Badge>
											<span className="font-medium">{participant.name}</span>
										</div>
										<Badge variant="secondary" className="font-bold">
											{participant.score}{" "}
											{participant.score === 1 ? "win" : "wins"}
										</Badge>
									</div>
								))}

								{participants.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No participants available
									</p>
								)}
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right side: Schedule */}
				<div className="md:col-span-2 gap-y-4 flex flex-col">
					{schedule.matches.map((match) => (
						<MatchPreview
							key={match.id}
							match={match}
							participants={participants}
							currentMatchId={currentMatchId}
						/>
					))}
					{/* <Card>
						<CardHeader>
							<CardTitle>Matches</CardTitle>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{schedule.matches.map((match) => {
									const matchParticipants = match.participants
										.map((p) => {
											return participants.find((part) => part.id === p);
										})
										.filter(Boolean);

									return (
										<Card key={match.id} className="border">
											<CardContent className="flex flex-col gap-2 pt-4">
												<div className="flex justify-between items-center">
													<p className="text-lg font-bold">{match.name}</p>
													{match.winner && (
														<Badge className="px-2 py-1">
															Winner:{" "}
															{participants.find(
																(p) => p.id === match.winner?.id,
															)?.name || "Unknown"}
														</Badge>
													)}
												</div>
												<div className="flex items-center justify-center gap-4 mt-2">
													<Badge
														variant="secondary"
														className="text-lg px-3 py-1"
													>
														{matchParticipants[0]?.name || "TBD"}
													</Badge>
													<p>vs</p>
													<Badge
														variant="secondary"
														className="text-lg px-3 py-1"
													>
														{matchParticipants[1]?.name || "TBD"}
													</Badge>
												</div>
											</CardContent>
										</Card>
									);
								})}

								{schedule.matches.length === 0 && (
									<p className="text-sm text-muted-foreground italic">
										No matches scheduled yet
									</p>
								)}
							</div>
						</CardContent>
					</Card> */}
				</div>
			</div>
		</div>
	);
}
