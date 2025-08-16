import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { MatchTimer } from "./-timer-new";
// import { pauseTimer } from "./-timer";

// export const ServerRoute = createServerFileRoute("/api/timer/pause").methods({
// 	GET: () => {
// 		console.log("PAUSING TIMER")
// 		const timer = pauseTimer();
// 		return json({ message: "Timer paused", timer });
// 	},
// });

export const ServerRoute = createServerFileRoute("/api/timer/pause").methods({
	GET: () => {
		console.log("PAUSING TIMER");
		const timer = MatchTimer.pause();
		return json({ message: "Timer paused", timer });
	},
});
