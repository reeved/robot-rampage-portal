import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/ranking/")({
	component: RouteComponent,
});

function RouteComponent() {
	return <div>Hello "/ranking/"!</div>;
}
