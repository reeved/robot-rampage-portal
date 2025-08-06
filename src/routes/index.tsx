import { Link, createFileRoute } from "@tanstack/react-router";
import { TimerComponent } from "./_view_/-timer";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="flex flex-col gap-10 p-10">
			<div className="text-primary font-heading uppercase text-xl">Robot Rampage Portal</div>
			<Link to="/admin" className="p-4 bg-card">
				Go to admin
			</Link>
			<Link to="/admin/mobile" className="p-4 bg-card">
				Go to mobile admin
			</Link>
			<TimerComponent />
		</div>
	);
}
