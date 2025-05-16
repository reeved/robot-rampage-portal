import type { Event, Participant, Schedule } from "@/db";

type Props = {
	rankings: Event["rankings"];
	qualifyingResults: Event["qualifyingResults"];
	participants: Participant[];
};

export const Rankings = ({
	rankings,
	qualifyingResults,
	participants,
}: Props) => {
	const sortedParticipants = rankings.map((ranking) => {
		const participant = participants.find(
			(participant) => participant.id === ranking.id,
		);
		return participant;
	});

	return (
		<div className="bg-card rounded-md p-4 flex flex-col h-full justify-between">
			{sortedParticipants?.map((participant, index) => {
				if (!participant) {
					return null;
				}
				return (
					<div
						key={participant?.id}
						className="flex justify-between items-center gap-4"
					>
						<span className="text-lg font-extrabold w-[2ch] text-right mr-4">
							{index + 1}
						</span>
						<span className="flex-1 text-2xl font-extrabold uppercase">
							{participant?.name}
						</span>
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
