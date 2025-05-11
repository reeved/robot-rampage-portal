import { Schedule, ScheduleSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSchedule } from "./$id";
import { QualifyingMatchForm } from "./-qualifying-match-form";

const updateSchedule = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(ScheduleSchema)
	.handler(async ({ data, context }) => {
		context.db.schedule.updateOne((s) => s.id === data.id, data);
		return data;
	});

export const Route = createFileRoute("/admin/schedule/$id/$matchId")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const matchId = Route.useParams().matchId;
	const { schedule, participants } = Route.useLoaderData();
	const match = schedule.matches.find((match) => match.id === matchId);

	const handleUpdate = (data: Schedule["matches"][number]) => {
		const updatedMatches = schedule.matches.map((match) => {
			if (match.id === data.id) {
				return { ...match, ...data };
			}
			return match;
		});

		return updateSchedule({ data: { ...schedule, matches: updatedMatches } });
	};

	if (!match) {
		return <div>Match not found</div>;
	}

	return (
		<div key={matchId}>
			<QualifyingMatchForm
				participants={participants}
				onSubmit={handleUpdate}
				defaultValues={match}
			/>
		</div>
	);
}
