import { createFileRoute } from "@tanstack/react-router";
import { useTimer } from "../_view_/-timer";

export const Route = createFileRoute("/admin_/timer")({
	component: RouteComponent,
});

function RouteComponent() {
	const { currentTime } = useTimer();

	return (
		<div className="h-full w-full overflow-hidden flex justify-center items-center text-center text-primary font-extrabold text-[950px]">
			<div className="font-bold text-center flex items-center justify-center">
				<div className="w-[1ch]">{currentTime.minutes}</div>
				<div className="w-[1ch] mb-50">:</div>
				<div className="w-[1ch]">{currentTime.seconds[0]}</div>
				<div className="w-[1ch]">{currentTime.seconds[1]}</div>
			</div>
		</div>
	);
}
