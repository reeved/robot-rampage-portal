import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { pauseTimer } from "./-timer";

export const ServerRoute = createServerFileRoute("/api/timer/pause").methods({
	GET: () => {
		const timer = pauseTimer();
		return json({ message: "Timer paused", timer });
	},
});
