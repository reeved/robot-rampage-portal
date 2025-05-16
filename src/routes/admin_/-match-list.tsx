import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Match, Participant, Schedule } from "@/db";
import { cn } from "@/lib/utils";
import { Link } from "@tanstack/react-router";

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
			<CardContent className="flex flex-col gap-4 items-center">
				<p
					className={cn(
						"text-sm font-bold",
						match.id === currentMatchId && "text-green-500",
					)}
				>
					{match.name}
				</p>
				<div className="flex items-center gap-4">
					<Badge
						variant="secondary"
						className={cn(
							"text-sm",
							bot1 && match.winner?.id === bot1.id && "text-amber-400",
						)}
					>
						{bot1?.name || "TBD"}
					</Badge>
					<p>vs</p>
					<Badge
						variant="secondary"
						className={cn(
							"text-sm",
							bot2 && match.winner?.id === bot2.id && "text-amber-400",
						)}
					>
						{bot2?.name || "TBD"}
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

export const MatchList = ({
	schedule,
	participants,
	currentMatchId,
}: Props) => {
	return (
		<>
			{schedule.matches.map((match) => {
				const [bot1, bot2] = match.participants
					.map((p) => {
						return participants.find((part) => part.id === p.id);
					})
					.filter(Boolean);

				return (
					<Link
						to="/admin/mobile/$id/$matchId"
						params={{ id: schedule.id, matchId: match.id }}
						key={match.id}
					>
						<MatchCard
							match={match}
							currentMatchId={currentMatchId}
							bot1={bot1}
							bot2={bot2}
						/>
					</Link>
				);
			})}
		</>
	);
};
