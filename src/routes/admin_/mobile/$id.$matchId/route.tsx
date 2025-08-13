import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/admin_/mobile/$id/$matchId")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			Hello "/admin_/mobile/$id/matchId"!
			<Outlet />
		</div>
	);
}
