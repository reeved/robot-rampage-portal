import { createFileRoute } from "@tanstack/react-router";
import { QueueMatchForm } from "@/routes/admin/schedule/-queue-match-form";
import { ResultForm } from "@/routes/admin/schedule/-result-form";
import { getSchedule } from "@/routes/admin/schedule/$id";
import { MatchCard } from "../-match-list";

export const Route = createFileRoute("/admin_/mobile/$id/$matchId/score")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const matchId = Route.useParams().matchId;
	const { schedule, participants, currentMatchId } = Route.useLoaderData();
	const match = schedule.matches.find((match) => match.id === matchId);

	if (!match) {
		return <div>Match not found</div>;
	}

	const [bot1, bot2] = match.participants
		.map((p) => {
			return participants.find((part) => part.id === p.id);
		})
		.filter(Boolean);

	return (
		<div className="flex flex-col gap-2 p-2">
			<MatchCard match={match} currentMatchId={currentMatchId} bot1={bot1} bot2={bot2} />
			<QueueMatchForm match={match} participants={participants} />
			<ResultForm
				key={`${match.winner?.id}-${match.winner?.condition}`}
				scheduleId={schedule.id}
				match={match}
				participants={participants}
			/>
		</div>
	);
}
