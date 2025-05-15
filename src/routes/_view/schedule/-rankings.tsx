import type { Participant, Schedule } from "@/db";

const sortParticipantsByRanking = (
	matches: Schedule["matches"],
	participants: Participant[],
) => {
	const statsByParticipant: Record<
		string,
		{ wins: number; ko: number; losses: number }
	> = {};
	// Initialize stats for all participants
	// biome-ignore lint/complexity/noForEach: <explanation>
	participants.forEach((participant) => {
		statsByParticipant[participant.id] = { wins: 0, ko: 0, losses: 0 };
	});

	// biome-ignore lint/complexity/noForEach: <explanation>
	matches.forEach((match) => {
		// Process winner
		if (match.winner) {
			// biome-ignore lint/style/noNonNullAssertion: <explanation>
			const winnerId = match.winner.id!;

			statsByParticipant[winnerId].wins += 1;

			if (match.winner.condition === "KO") {
				statsByParticipant[winnerId].ko += 1;
			}
		}

		// Process losers (all participants except the winner)
		if (match.participants && match.winner) {
			// biome-ignore lint/complexity/noForEach: <explanation>
			match.participants.forEach((part) => {
				if (
					part.id !== match.winner?.id &&
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					statsByParticipant[part.id!]
				) {
					// biome-ignore lint/style/noNonNullAssertion: <explanation>
					statsByParticipant[part.id!].losses += 1;
				}
			});
		}
	});

	const participantsWithScores = participants.map((participant) => ({
		...participant,
		wins: statsByParticipant[participant.id]?.wins || 0,
		ko: statsByParticipant[participant.id]?.ko || 0,
		losses: statsByParticipant[participant.id]?.losses || 0,
	}));

	const sortedParticipants = participantsWithScores.sort((a, b) => {
		// sort by wins, then by KO
		const aWins = statsByParticipant[a.id]?.wins || 0;
		const bWins = statsByParticipant[b.id]?.wins || 0;
		const aKo = statsByParticipant[a.id]?.ko || 0;
		const bKo = statsByParticipant[b.id]?.ko || 0;
		if (aWins !== bWins) {
			return bWins - aWins;
		}
		if (aKo !== bKo) {
			return bKo - aKo;
		}
		return a.name.localeCompare(b.name);
	});

	return sortedParticipants;
};

type Props = {
	schedules: Schedule[];
	participants: Participant[];
};

export const Rankings = ({ schedules, participants }: Props) => {
	const allCompletedMatches = schedules
		.flatMap((schedule) => schedule.matches)
		.filter((match) => !!match.winner?.id);

	const sortedParticipants = sortParticipantsByRanking(
		allCompletedMatches,
		participants,
	);

	return (
		<div className="bg-card rounded-md p-4 flex flex-col h-full justify-between">
			{sortedParticipants.map((participant, index) => (
				<div
					key={participant.id}
					className="flex justify-between items-center gap-4"
				>
					<span className="text-lg font-extrabold w-[2ch] text-right mr-4">
						{index + 1}
					</span>
					<span className="flex-1 text-2xl font-extrabold uppercase">
						{participant.name}
					</span>
					<span className="font-bold flex gap-2 text-2xl">
						<span className="text-green-500 rounded-md w-[3ch] text-right">{`${participant.wins}W`}</span>
						<span className="w-[2ch] text-center">|</span>
						<span className="text-red-500 w-[3ch]">{`${participant.losses}L`}</span>
					</span>
				</div>
			))}
		</div>
	);
};
