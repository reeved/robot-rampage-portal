import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { EventTimer } from "../-timer-new";

export const ServerRoute = createServerFileRoute("/api/timer/event/restart").methods({
	GET: () => {
		const timer = EventTimer.restart();
		return json({ message: "Timer reset", timer });
	},
});
