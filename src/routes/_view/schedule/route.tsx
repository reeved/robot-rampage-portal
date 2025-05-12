import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_view/schedule")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="w-full h-full pt-10">
			{/* <div className="font-heading mx-auto w-full text-center text-4xl text-primary">
				MATCH SCHEDULE
			</div> */}

			<Outlet />
		</div>
	);
}
