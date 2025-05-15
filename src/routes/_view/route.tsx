import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_view")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full w-full bg-neutral-200">
			<div className="flex flex-col h-[1080px] w-[1920px] bg-[url(/background-7.svg)] overflow-y-hidden">
				<img
					src="/rr-logo.png"
					alt="Robot rampage logo"
					className="h-[100px] mx-auto pt-10 -pb-6"
				/>
				<div className="h-full w-full backdrop-brightness-150">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
