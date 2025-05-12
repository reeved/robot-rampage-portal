import { Schedule, ScheduleSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSchedule } from "./$id";
import { QualifyingMatchForm } from "./-qualifying-match-form";
import { QueueMatchForm } from "./-queue-match-form";

export const updateSchedule = createServerFn({
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
	const router = useRouter();
	const navigate = Route.useNavigate();
	const matchId = Route.useParams().matchId;
	const { schedule, participants } = Route.useLoaderData();
	const match = schedule.matches.find((match) => match.id === matchId);

	const handleUpdate = async (data: Schedule["matches"][number]) => {
		const updatedMatches = schedule.matches.map((match) => {
			if (match.id === data.id) {
				return { ...match, ...data };
			}
			return match;
		});

		await updateSchedule({ data: { ...schedule, matches: updatedMatches } });
		router.invalidate();
		return navigate({ to: "/admin/schedule/$id", params: { id: schedule.id } });
	};

	if (!match) {
		return <div>Match not found</div>;
	}

	return (
		<div key={matchId} className="flex flex-col gap-y-6">
			<QualifyingMatchForm
				participants={participants}
				onSubmit={handleUpdate}
				defaultValues={match}
			/>
			<QueueMatchForm match={match} participants={participants} />
		</div>
	);
}
