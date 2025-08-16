import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
// import { TimerStore } from "./-timer";

// export const ServerRoute = createServerFileRoute("/api/timer/").methods({
// 	GET: async () => {
// 		return json(TimerStore.countdownTimer);
// 	},
// });

import { MatchTimer } from "./-timer-new";

export const ServerRoute = createServerFileRoute("/api/timer/").methods({
	GET: async () => {
		return json(MatchTimer.getState());
	},
});
