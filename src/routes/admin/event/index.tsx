import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/event/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div className="p-4">Hello "/admin/event/"!</div>;
}
