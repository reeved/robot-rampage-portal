import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full flex flex-col">
			<Outlet />
		</div>
	);
}
