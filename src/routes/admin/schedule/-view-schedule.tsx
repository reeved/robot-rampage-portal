import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { Participant, Schedule } from "@/db";
import { Link } from "@tanstack/react-router";

export const ViewSchedule = ({
	schedule,
	participants,
}: { schedule: Schedule; participants: Participant[] }) => {
	// Calculate the number of matches each participant is in
	const participantMatchCounts: Record<string, number> = {};

	// Initialize counts for all participants
	for (const participant of participants) {
		participantMatchCounts[participant.id] = 0;
	}

	// Count matches for each participant
	for (const match of schedule.matches) {
		for (const participantId of match.participants) {
			if (participantMatchCounts[participantId] !== undefined) {
				participantMatchCounts[participantId]++;
			}
		}
	}

	return (
		<div className="flex gap-6">
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex items-center justify-between">
					<h1 className="text-2xl font-bold">{schedule.name}</h1>

					<Link to="/admin/schedule/$id/new" params={{ id: schedule.id }}>
						<Button type="button" variant="default">
							Add new match +
						</Button>
					</Link>
				</div>
				{schedule.matches.map((match) => {
					const matchParticipants = match.participants
						.map((p) => {
							return participants.find((part) => part.id === p);
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
			{/*
			<div className="w-72">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserIcon className="h-5 w-5" />
							Participants
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1">
							{participants.map((participant) => (
								<div
									key={participant.id}
									className="flex justify-between items-center py-2 border-b last:border-0"
								>
									<span className="font-medium">{participant.name}</span>
									<Badge
										variant={
											participantMatchCounts[participant.id] > 0
												? "default"
												: "outline"
										}
									>
										{participantMatchCounts[participant.id]}{" "}
										{participantMatchCounts[participant.id] === 1
											? "match"
											: "matches"}
									</Badge>
								</div>
							))}

							{participants.length === 0 && (
								<p className="text-sm text-muted-foreground italic">
									No participants available
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div> */}
		</div>
	);
};
