import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_view")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full w-full bg-neutral-200">
			<div className="flex flex-col h-[1080px] w-[1920px] bg-[url(/background-4.svg)] overflow-y-hidden">
				<img
					src="/rr-logo.png"
					alt="Robot rampage logo"
					className="h-[60px] mx-auto mt-10 -mb-6"
				/>
				<div className="h-full w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
