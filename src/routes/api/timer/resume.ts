import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { Timer } from "./-timer-new";
// import { resumeTimer } from "./-timer";

// export const ServerRoute = createServerFileRoute("/api/timer/resume").methods({
// 	GET: async ({ request }) => {
// 		const searchParams = new URL(request.url).searchParams;
// 		const shouldCountdown = searchParams.get("countdown") === "true";

// 		const timer = await resumeTimer(shouldCountdown);
// 		return json({ message: "Timer resumed", timer });
// 	},
// });

export const ServerRoute = createServerFileRoute("/api/timer/resume").methods({
	GET: async ({ request }) => {
		const searchParams = new URL(request.url).searchParams;
		const shouldCountdown = searchParams.get("countdown") === "true";

		const timer = await Timer.resume(shouldCountdown);
		return json({ message: "Timer resumed", timer });
	},
});
