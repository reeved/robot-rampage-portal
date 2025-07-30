import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { resumeTimer } from "./-timer";

export const ServerRoute = createServerFileRoute("/api/timer/resume").methods({
	GET: () => {
		const timer = resumeTimer();
		return json({ message: "Timer resumed", timer });
	},
});
