import { Schedule, ScheduleSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { getSchedule } from "./$id.view";
import { QualifyingForm } from "./-qualifying-form";

const updateSchedule = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(ScheduleSchema)
	.handler(async ({ data, context }) => {
		context.db.schedule.updateOne((s) => s.id === data.id, data);
		return data;
	});

export const Route = createFileRoute("/admin/schedule/$id/edit")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const { schedule, participants } = Route.useLoaderData();

	const handleUpdate = (data: Schedule) => {
		return updateSchedule({ data });
	};

	return (
		<div className="w-full max-w-[1200px] mx-auto">
			<QualifyingForm
				participants={participants}
				onSubmit={handleUpdate}
				defaultValues={schedule}
			/>
		</div>
	);
}
