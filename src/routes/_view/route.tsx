import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_view")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full w-full bg-neutral-200">
			<div className="h-[1080px] w-[1920px] bg-background overflow-y-hidden">
				<img
					src="/rr-logo.png"
					alt="Robot rampage logo"
					className="h-[60px] mx-auto mt-4"
				/>
				<Outlet />
			</div>
		</div>
	);
}
