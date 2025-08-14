import { createFileRoute } from "@tanstack/react-router";
import { getSchedule } from "@/routes/admin/schedule/$id";
import { QueueMatchForm } from "../../../admin/schedule/-queue-match-form";
import { ResultForm } from "../../../admin/schedule/-result-form";
import { MatchCard } from "../-match-list";

export const Route = createFileRoute("/admin_/mobile/$id/$matchId/")({
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
		<div className="flex flex-col gap-5 p-4">
			<MatchCard match={match} currentMatchId={currentMatchId} bot1={bot1} bot2={bot2} />
			<QueueMatchForm match={match} participants={participants} />
			<ResultForm scheduleId={schedule.id} match={match} participants={participants} />
		</div>
	);
}
