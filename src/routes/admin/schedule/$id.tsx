import { dbMiddleware } from "@/middleware";
import { Outlet, createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ViewSchedule } from "./-view-schedule";

export const getSchedule = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		console.log("getSchedule", id);
		const schedule = await context.db.schedule.findOne((p) => p.id === id);
		const participants = await context.db.participants.find(() => true);

		if (!schedule) {
			throw redirect({ to: "/admin/schedule" });
		}
		return { schedule, participants };
	});

export const Route = createFileRoute("/admin/schedule/$id")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const { schedule, participants } = Route.useLoaderData();

	return (
		<div className="w-full grid grid-cols-2 gap-20">
			<ViewSchedule schedule={schedule} participants={participants} />
			<Outlet />
		</div>
	);
}
