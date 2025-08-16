import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { EventTimer } from "../-timer-new";

export const ServerRoute = createServerFileRoute("/api/timer/event/pause").methods({
	GET: () => {
		console.log("PAUSING TIMER");
		const timer = EventTimer.pause();
		return json({ message: "Timer paused", timer });
	},
});
