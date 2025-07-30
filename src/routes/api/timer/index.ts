import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { TimerStore, getTimerStatus } from "./-timer";

export const ServerRoute = createServerFileRoute("/api/timer/").methods({
	GET: async ({ request, params }) => {
		return json(TimerStore.countdownTimer);
	},
});
