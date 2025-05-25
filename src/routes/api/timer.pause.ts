import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { pauseTimer } from "./-timer";

export const APIRoute = createAPIFileRoute("/api/timer/pause")({
	GET: () => {
		const timer = pauseTimer();
		return json({ message: "Timer paused", timer });
	},
});
