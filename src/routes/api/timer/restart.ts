import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { resetTimer } from "./-timer";

export const ServerRoute = createServerFileRoute("/api/timer/restart").methods({
	GET: () => {
		const timer = resetTimer();
		return json({ message: "Timer reset", timer });
	},
});
