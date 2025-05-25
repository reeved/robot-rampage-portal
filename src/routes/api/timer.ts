import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { TimerStore, getTimerStatus } from "./-timer";

export const APIRoute = createAPIFileRoute("/api/timer")({
	GET: async ({ request, params }) => {
		const timerStatus = await getTimerStatus();

		console.log("GET /api/timer", { timerStatus: timerStatus });

		console.log("TIMER", TimerStore.countdownTimer, timerStatus);

		return json(TimerStore.countdownTimer);
	},
});
