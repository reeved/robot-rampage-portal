import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { EventTimer } from "../-timer-new";

export const ServerRoute = createServerFileRoute("/api/timer/event/resume").methods({
	GET: async ({ request }) => {
		const searchParams = new URL(request.url).searchParams;
		const shouldCountdown = searchParams.get("countdown") === "true";

		const timer = await EventTimer.resume(shouldCountdown);
		return json({ message: "Timer resumed", timer });
	},
});
