import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { resumeTimer } from "./-timer";

export const APIRoute = createAPIFileRoute("/api/timer/resume")({
	GET: () => {
		const timer = resumeTimer();
		return json({ message: "Timer resumed", timer });
	},
});
