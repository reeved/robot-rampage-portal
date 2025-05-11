import { Participant, Schedule } from "@/db";
import { cn } from "@/lib/utils";

type Props = {
	match: Schedule["matches"][number];
	participants: Participant[];
	currentMatchId: string | undefined;
};

export const MatchPreview = ({
	match,
	participants,
	currentMatchId,
}: Props) => {
	const [bot1, bot2] = match.participants.map((id) =>
		participants.find((p) => p.id === id),
	) as Participant[];

	return (
		<div className="flex items-center relative">
			<div className="w-full bg-card rounded-md flex items-center py-2 h-12 text-xl font-rubik relative z-30">
				<div className="flex flex-1 text-right">
					<span
						className={cn(
							"text-right w-full",
							match.winner?.id === bot1.id && "text-amber-400",
						)}
					>
						{bot1.name}
					</span>
				</div>
				<div className="w-[10ch] text-center text-sm text-primary">vs</div>
				<div className="flex flex-1">
					<span
						className={cn(
							"text-left w-full",
							match.winner?.id === bot2.id && "text-amber-400",
						)}
					>
						{bot2.name}
					</span>
				</div>
			</div>
			{currentMatchId && currentMatchId === match.id && (
				<div className="absolute bg-primary -right-45 h-11 bottom-0.5 z-2 px-5 flex items-center w-[12ch] justify-center rounded-md font-rubik text-xl">
					UP NEXT
				</div>
			)}
		</div>
	);
};
