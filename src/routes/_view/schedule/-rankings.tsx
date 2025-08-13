import type { Event, Participant } from "@/db";
import { cn } from "@/lib/utils";

type Props = {
	rankings: Event["qualifyingRankings"];
	qualifyingResults: Event["qualifyingResults"];
	participants: Participant[];
};

export const Rankings = ({ rankings, qualifyingResults, participants }: Props) => {
	const sortedParticipants = rankings.map((ranking) => {
		const participant = participants.find((participant) => participant.id === ranking.id);
		return participant;
	});

	const aliveParticipants = sortedParticipants.filter((participant) => participant && !participant.isDead);

	const deadParticipants = sortedParticipants.filter((participant) => participant?.isDead);

	return (
		<div className="bg-card rounded-md p-4 flex flex-col h-full justify-between">
			{[...aliveParticipants, ...deadParticipants]?.map((participant, index) => {
				if (!participant) {
					return null;
				}
				return (
					<div
						key={participant?.id}
						className={cn("flex justify-between items-center gap-4", participant?.isDead && "opacity-30")}
					>
						<span className="text-lg font-extrabold w-[2ch] text-right mr-4">{index + 1}</span>
						<span className={cn("flex-1 text-2xl font-extrabold uppercase")}>{participant?.name}</span>
						<span className="font-bold flex gap-2 text-2xl">
							<span className="text-green-500 rounded-md w-[3ch] text-right">{`${qualifyingResults[participant?.id]?.wins}W`}</span>
							<span className="w-[2ch] text-center">|</span>
							<span className="text-red-500 w-[3ch]">{`${qualifyingResults[participant?.id]?.losses}L`}</span>
						</span>
					</div>
				);
			})}
		</div>
	);
};
