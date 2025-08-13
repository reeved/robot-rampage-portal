import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_view/results/")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-center mx-155 mt-4">
				<h2 className="text-3xl font-heading text-center text-primary uppercase">AUGUST 2025</h2>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
