import {
	type BracketMatch,
	type QualifyingMatch,
	type Schedule,
	ScheduleSchema,
} from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSchedule } from "./$id";
import { BracketMatchForm } from "./-bracket-match-form";
import { QualifyingMatchForm } from "./-qualifying-match-form";
import { QueueMatchForm } from "./-queue-match-form";
import { ResultForm } from "./-result-form";

export const updateScheduleFn = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(ScheduleSchema)
	.handler(async ({ data, context }) => {
		context.db.schedule.updateOne((s) => s.id === data.id, data);
		return data;
	});

export const updateSchedule = async (schedule: Schedule) => {
	await updateScheduleFn({
		data: schedule,
	});
};

export const Route = createFileRoute("/admin/schedule/$id/$matchId")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const matchId = Route.useParams().matchId;
	const { schedule, participants, bracketNames } = Route.useLoaderData();
	const match = schedule.matches.find((match) => match.id === matchId);

	const handleUpdate = async (data: Schedule["matches"][number]) => {
		const updatedMatches = schedule.matches.map(
			(match): Schedule["matches"][number] => {
				if (match.id === data.id) {
					return { ...match, ...data };
				}
				return match;
			},
		);

		await updateSchedule({
			...schedule,
			matches: updatedMatches,
		} as any);

		router.invalidate();
		return navigate({ to: "/admin/schedule/$id", params: { id: schedule.id } });
	};

	if (!match) {
		return <div>Match not found</div>;
	}

	return (
		<div key={matchId} className="flex flex-col gap-y-6">
			{schedule.type === "QUALIFYING" ? (
				<QualifyingMatchForm
					participants={participants}
					onSubmit={handleUpdate}
					defaultValues={match}
				/>
			) : schedule.type === "BRACKET" ? (
				<BracketMatchForm
					bracketNames={bracketNames}
					participants={participants}
					onSubmit={handleUpdate}
					defaultValues={match}
				/>
			) : null}

			<div className="flex gap-10">
				<QueueMatchForm match={match} participants={participants} />
				<ResultForm
					scheduleId={schedule.id}
					match={match}
					participants={participants}
				/>
			</div>
		</div>
	);
}
