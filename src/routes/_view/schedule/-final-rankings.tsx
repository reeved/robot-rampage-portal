import type { Event, Participant } from "@/db";
import { cn } from "@/lib/utils";

type Props = {
	rankings: Event["finalRankings"];
	participants: Participant[];
};

export const FinalRankings = ({ rankings, participants }: Props) => {
	const sortedRankings = rankings
		?.sort((a, b) => a.position - b.position)
		.map((ranking) => {
			const participant = participants.find((participant) => participant.id === ranking.id);
			return {
				...ranking,
				participant,
			};
		});

	const competingParticipants = participants.filter(
		(participant) => participant.type === "FEATHERWEIGHT" && participant.isCompeting,
	);

	return (
		<div className="bg-card rounded-md p-4 flex flex-col h-full justify-between">
			{competingParticipants?.map((_, index) => {
				const bot = sortedRankings?.find((ranking) => ranking.position === index + 1);
				const participant = bot?.participant;

				return (
					<div
						key={`ranking-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
						className={cn("flex justify-between items-center gap-4", participant?.isDead && "opacity-30")}
					>
						<span className="text-lg font-extrabold w-[2ch] text-right mr-4">{index + 1}</span>
						<span
							className={cn(
								"flex-1 text-xl font-extrabold uppercase",
								participant?.name?.length && participant?.name?.length > 15 && "text-md",
							)}
						>
							{participant?.name}
						</span>
					</div>
				);
			})}
		</div>
	);
};
