import { Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Match, Participant, Schedule } from "@/db";
import { cn } from "@/lib/utils";

export const MatchCard = ({
	match,
	currentMatchId,
	bot1,
	bot2,
}: {
	match: Match;
	currentMatchId: string | undefined;
	bot1: Participant | undefined;
	bot2: Participant | undefined;
}) => {
	return (
		<Card className={cn("p-2")}>
			<CardContent className="p-0 flex flex-col gap-4 items-center md:flex-row ">
				<p
					className={cn(
						"text-sm font-bold shrink-0 md:w-1/6 md:text-lg",
						match.id === currentMatchId && "text-green-500",
					)}
				>
					{match.name}
				</p>
				<div className="flex items-center justify-center gap-4 w-full md:justify-center">
					<Badge
						variant="secondary"
						className={cn(
							"text-sm w-5/12 min-w-0 truncate md:max-w-[30ch] md:py-2 md:text-lg",
							bot1 && match.winner?.id === bot1.id && "text-amber-400",
						)}
					>
						<p className="truncate text-center">{bot1?.name || "TBD"}</p>
					</Badge>
					<p className="text-lg font-bold">vs</p>
					<Badge
						variant="secondary"
						className={cn(
							"text-sm w-5/12 min-w-0 truncate md:max-w-[30ch] md:py-2 md:text-lg",
							bot2 && match.winner?.id === bot2.id && "text-amber-400",
						)}
					>
						<p className="truncate text-center">{bot2?.name || "TBD"}</p>
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
};

type Props = {
	schedule: Schedule;
	participants: Participant[];
	currentMatchId: string | undefined;
};

export const MatchList = ({ schedule, participants, currentMatchId }: Props) => {
	return (
		<>
			<div className="mt-16" />
			{schedule.matches.map((match) => {
				const [bot1, bot2] = match.participants
					.map((p) => {
						return participants.find((part) => part.id === p.id);
					})
					.filter(Boolean);

				return (
					<Link to="/admin/mobile/$id/$matchId/info" params={{ id: schedule.id, matchId: match.id }} key={match.id}>
						<MatchCard match={match} currentMatchId={currentMatchId} bot1={bot1} bot2={bot2} />
					</Link>
				);
			})}
		</>
	);
};
