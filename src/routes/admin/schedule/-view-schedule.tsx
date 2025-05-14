import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Participant, Schedule } from "@/db";
import { Link } from "@tanstack/react-router";

export const ViewSchedule = ({
	schedule,
	participants,
}: { schedule: Schedule; participants: Participant[] }) => {
	return (
		<div className="flex gap-6">
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">{schedule.name}</h1>

					<Link
						to={
							schedule.type === "QUALIFYING"
								? "/admin/schedule/$id/new"
								: "/admin/schedule/$id/newbracket"
						}
						params={{ id: schedule.id }}
					>
						<Button type="button" variant="default">
							Add new match +
						</Button>
					</Link>
				</div>
				{schedule.matches.map((match) => {
					const matchParticipants = match.participants
						.map((p) => {
							return participants.find((part) => part.id === p.id);
						})
						.filter(Boolean) as Participant[];

					return (
						<Link
							key={match.id}
							to="/admin/schedule/$id/$matchId"
							params={{ id: schedule.id, matchId: match.id }}
						>
							<Card className="p-2">
								<CardContent className="flex gap-4 items-center">
									<p className="text-lg font-bold">{match.name}</p>
									<div className="flex items-center gap-4">
										<Badge variant="secondary" className="text-lg">
											{matchParticipants[0]?.name || "TBD"}
										</Badge>
										<p>vs</p>
										<Badge variant="secondary" className="text-lg">
											{matchParticipants[1]?.name || "TBD"}
										</Badge>
									</div>
								</CardContent>
							</Card>
						</Link>
					);
				})}
			</div>
		</div>
	);
};
