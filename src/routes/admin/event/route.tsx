import { createFileRoute, Link, Outlet, useChildMatches } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin/event")({
	component: RouteComponent,
});

function RouteComponent() {
	const childRoutes = useChildMatches();
	console.log(childRoutes);

	return (
		<div className="py-6 grid grid-cols-6 gap-4 h-full">
			<div className="col-span-1 border-r-2 border-white px-4">
				<h1 className="text-2xl font-bold mb-6">Event config</h1>
				<div className="flex flex-col gap-2">
					<Link to="/admin/event/general">
						<Button variant="secondary" className="w-full">
							General
						</Button>
					</Link>
					<Link to="/admin/event/final-rankings">
						<Button variant="secondary" className="w-full">
							Final rankings
						</Button>
					</Link>
					<Link to="/admin/event/timer">
						<Button variant="secondary" className="w-full">
							Timer
						</Button>
					</Link>
				</div>
			</div>
			<div className="col-span-5">
				<Outlet />
			</div>
		</div>
	);
}
