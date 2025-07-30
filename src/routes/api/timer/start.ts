import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { startTimer } from "./-timer";

export const ServerRoute = createServerFileRoute("/api/timer/start").methods({
	GET: ({ request }) => {
		const searchParams = new URL(request.url).searchParams;
		const duration = searchParams.get("duration");

		if (!duration || Number.isNaN(Number(duration))) {
			return json({ error: "Invalid duration parameter" }, { status: 400 });
		}

		const timer = startTimer(Number(duration));
		return json({ message: "Timer started", timer });
	},
});
