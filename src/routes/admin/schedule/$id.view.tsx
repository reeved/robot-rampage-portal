import { dbMiddleware } from "@/middleware";
import {
	Link,
	Outlet,
	createFileRoute,
	redirect,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ViewSchedule } from "./-view-schedule";

export const getSchedule = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const schedule = await context.db.schedule.findOne((p) => p.id === id);
		const participants = await context.db.participants.find(() => true);

		if (!schedule) {
			throw redirect({ to: "/admin/schedule" });
		}
		return { schedule, participants };
	});

export const Route = createFileRoute("/admin/schedule/$id/view")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const { schedule, participants } = Route.useLoaderData();

	return (
		<div className="w-full max-w-[1200px] mx-auto">
			<div className="mb-4">
				<Link
					to="/admin/schedule/$id/edit"
					params={{ id: Route.useParams().id }}
					className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
				>
					Edit Schedule
				</Link>
			</div>
			<ViewSchedule schedule={schedule} participants={participants} />
			<Outlet />
		</div>
	);
}
