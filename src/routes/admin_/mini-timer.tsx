import { createFileRoute } from "@tanstack/react-router";
import { TimerMiniPreview } from "../_view_/-timer-mini-preview";
import { Overlay } from "../_view_/overlay";

export const Route = createFileRoute("/admin_/mini-timer")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<Overlay>
			<div className="flex items-center justify-center p-4 absolute top-10  font-rubik">
				<p className="mx-3 -mt-2 font-rubik text-xl bg-black/40 px-4 py-2">Next match in</p>
				<TimerMiniPreview>3:00</TimerMiniPreview>
			</div>
		</Overlay>
	);
}
