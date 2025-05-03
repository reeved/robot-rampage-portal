import { Button } from "@/components/ui/button";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div className="h-full flex flex-col">
			<div className="flex">
				<Button>
					<Link to="/admin/participants">Participants</Link>
				</Button>
				<Button>
					<Link to="/admin/schedule">Schedules</Link>
				</Button>
			</div>
			<Outlet />
		</div>
	);
}
