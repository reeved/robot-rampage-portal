import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { TimerStore, getTimerStatus } from "./-timer";

export const APIRoute = createAPIFileRoute("/api/timer")({
	GET: async ({ request, params }) => {
		return json(TimerStore.countdownTimer);
	},
});
