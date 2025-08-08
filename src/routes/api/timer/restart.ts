import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { Timer } from "./-timer-new";
// import { resetTimer } from "./-timer";

// export const ServerRoute = createServerFileRoute("/api/timer/restart").methods({
// 	GET: () => {
// 		const timer = resetTimer();
// 		return json({ message: "Timer reset", timer });
// 	},
// });

export const ServerRoute = createServerFileRoute("/api/timer/restart").methods({
	GET: () => {
		const timer = Timer.restart();
		return json({ message: "Timer reset", timer });
	},
});
