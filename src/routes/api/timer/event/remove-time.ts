import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { EventTimer } from "../-timer-new";

export const ServerRoute = createServerFileRoute("/api/timer/event/remove-time").methods({
	GET: async ({ request }) => {
		const searchParams = new URL(request.url).searchParams;
		const time = searchParams.get("time");

		if ((!time && time !== "0") || Number.isNaN(Number(time))) {
			return json({ error: "Invalid duration parameter" }, { status: 400 });
		}

		EventTimer.removeTime(Number(time));
		return json({ message: "Timer removed", time });
	},
});
