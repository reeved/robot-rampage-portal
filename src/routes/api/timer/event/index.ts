import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { EventTimer } from "../-timer-new";

export const ServerRoute = createServerFileRoute("/api/timer/event/").methods({
	GET: async () => {
		return json(EventTimer.getState());
	},
});
