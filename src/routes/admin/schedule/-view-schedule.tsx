import { Button } from "@/components/ui/button";
import type { Participant, Schedule } from "@/db";
import { Link } from "@tanstack/react-router";
import { MatchList } from "./-match-list";
import { TeamsMatchList } from "./-teams-match-list";

export const ViewSchedule = ({
	schedule,
	participants,
	currentMatchId,
}: {
	schedule: Schedule;
	participants: Participant[];
	currentMatchId: string | undefined;
}) => {
	return (
		<div className="flex gap-6">
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">{schedule.name}</h1>

					{schedule.type !== "TEAMS" && (
						<Link
							to={
								schedule.type !== "BRACKET"
									? "/admin/schedule/$id/new"
									: "/admin/schedule/$id/newbracket"
							}
							params={{ id: schedule.id }}
						>
							<Button type="button" variant="default">
								Add new match +
							</Button>
						</Link>
					)}
				</div>

				{schedule.type === "TEAMS" ? (
					<TeamsMatchList schedule={schedule} participants={participants} />
				) : (
					<MatchList
						schedule={schedule}
						participants={participants}
						currentMatchId={currentMatchId}
					/>
				)}
			</div>
		</div>
	);
};
