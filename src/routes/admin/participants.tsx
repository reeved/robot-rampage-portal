import { dbMiddleware } from "@/middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getParticipants = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		return context.db.participants.find(() => true);
	});

export const Route = createFileRoute("/admin/participants")({
	component: RouteComponent,
	loader: async () => await getParticipants(),
});

function RouteComponent() {
	const participants = Route.useLoaderData();

	return <div>Hello "/admin/competitors"!</div>;
}
