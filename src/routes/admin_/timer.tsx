import { createFileRoute } from "@tanstack/react-router";
import { useTimer } from "../_view_/-timer";

export const Route = createFileRoute("/admin_/timer")({
	component: RouteComponent,
});

function RouteComponent() {
	const { currentTime: matchTime, customMessage: matchCustomMessage, timeLeft: matchTimeLeft } = useTimer("MATCH");
	const { currentTime: eventTime, customMessage: eventCustomMessage } = useTimer("EVENT");

	const currentTime = matchTimeLeft ? matchTime : eventTime;
	const customMessage = matchCustomMessage || eventCustomMessage;

	return (
		<div className="h-full w-full overflow-hidden flex justify-center items-center text-center text-primary font-extrabold text-[30vw]">
			<div className="font-bold text-center flex items-center justify-center">
				{customMessage ? (
					<p>{customMessage} </p>
				) : (
					<>
						<div className="w-[1ch]">{currentTime.minutes[0]}</div>
						<div className="w-[1ch]">{currentTime.minutes[1]}</div>
						<div className="w-[0.8ch] mb-30">:</div>
						<div className="w-[1ch]">{currentTime.seconds[0]}</div>
						<div className="w-[1ch]">{currentTime.seconds[1]}</div>
					</>
				)}
			</div>
		</div>
	);
}
