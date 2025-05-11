import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_view/ranking/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/ranking/"!</div>;
}
