import type { Participant, Schedule } from "@/db";
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
	const [bot1, bot2] = match.names
		? match.names.map((name) => ({ id: name, name }))
		: (match.participants.map((bot) =>
				participants.find((p) => p.id === bot?.id),
			) as Participant[]);

	return (
		<div className="flex items-center relative">
			<div className="w-full bg-card rounded-md flex items-center py-2 h-12 text-3xl uppercase relative z-30">
				<div className="flex flex-1 text-right">
					<span
						className={cn(
							"text-right w-full font-extrabold",
							bot1 && match.winner?.id === bot1.id && "text-amber-400",
							bot1 &&
								match.winner?.id &&
								match.winner?.id !== bot1.id &&
								"text-neutral-500",
						)}
					>
						{bot1?.name ?? "TBD"}
					</span>
				</div>
				<div className="w-[10ch] text-center text-lg text-primary font-rubik">
					vs
				</div>
				<div className="flex flex-1">
					<span
						className={cn(
							"text-left w-full font-extrabold",
							bot2 && match.winner?.id === bot2.id && "text-amber-400",
							bot2 &&
								match.winner?.id &&
								match.winner?.id !== bot2.id &&
								"text-neutral-500",
						)}
					>
						{bot2?.name ?? "TBD"}
					</span>
				</div>
			</div>
			{currentMatchId && currentMatchId === match.id && (
				<div className="absolute bg-primary -right-43 h-11 bottom-0.5 z-2 flex items-center w-[9ch] justify-center rounded-md font-rubik text-2xl">
					UP NEXT
				</div>
			)}
		</div>
	);
};
