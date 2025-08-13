import { TimerComponent } from "@/routes/_view_/-timer";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/event/timer")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div>
			<TimerComponent />
		</div>
	);
}
