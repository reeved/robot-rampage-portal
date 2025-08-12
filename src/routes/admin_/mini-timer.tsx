import { createFileRoute } from "@tanstack/react-router";
import { TimerMiniPreview } from "../_view_/-timer-mini-preview";
import { Overlay } from "../_view_/overlay";
import { TimeText, useTimer } from "../_view_/-timer";

export const Route = createFileRoute("/admin_/mini-timer")({
	component: RouteComponent,
});

function RouteComponent() {
	const { currentTime } = useTimer();

	if (currentTime.minutes === "0" && currentTime.seconds === "0") {
		return null
	}

	return (
		<Overlay>
			<div className="flex items-center justify-center p-4 absolute top-10  font-rubik">
				<p className="mx-3 -mt-2 font-rubik text-xl bg-black/40 px-4 py-2">Next match in</p>
				<TimerMiniPreview><TimeText currentTime={currentTime} /></TimerMiniPreview>
			</div>
		</Overlay>
	);
}
