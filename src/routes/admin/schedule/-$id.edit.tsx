import { type Schedule, ScheduleSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { QualifyingForm } from "./-qualifying-form";

const getSchedule = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const schedule = await context.db.schedule.findOne((p) => p.id === id);
		// const participants = await context.db.participants.find(() => true);

		if (!schedule) {
			throw redirect({ to: "/admin/schedule" });
		}
		return { schedule };
	});

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
	const { schedule } = Route.useLoaderData();

	return <div>"hello"</div>;
}
