import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";
import { resetTimer } from "./-timer";

export const APIRoute = createAPIFileRoute("/api/timer/restart")({
	GET: () => {
		const timer = resetTimer();
		return json({ message: "Timer reset", timer });
	},
});
