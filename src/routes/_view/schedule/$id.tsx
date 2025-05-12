import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { MatchPreview } from "./-match-preview";
import { Rankings } from "./-rankings";

// Reuse the same server function as admin but without directly importing it
const getScheduleData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const allSchedules = await context.db.schedule.find(() => true);
		const schedule = allSchedules.find((p) => p.id === id);
		const participants = await context.db.participants.find(() => true);
		const evt = await context.db.events.findOne((e) => e.id === "may");

		if (!schedule) {
			throw redirect({ to: "/schedule" });
		}

		console.log("allSchedules", allSchedules.length);
		console.log("schedule", schedule.name);

		return {
			allSchedules,
			schedule,
			participants,
			currentMatchId: evt?.currentMatchId,
		};
	});

const scheduleQuery = (id: string) =>
	queryOptions({
		queryKey: ["schedules"],
		queryFn: async () => getScheduleData({ data: id }),
		refetchInterval: 5000,
	});

export const Route = createFileRoute("/_view/schedule/$id")({
	component: RouteComponent,
	loader: async ({ params, context }) =>
		context.queryClient.ensureQueryData(scheduleQuery(params.id)),
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { data } = useQuery(scheduleQuery(id));

	if (!data) {
		return (
			<div className="w-full max-w-[1200px] mx-auto p-4">
				<p className="text-center text-muted-foreground italic">Loading...</p>
			</div>
		);
	}

	console.log("data", data);
	const { allSchedules, schedule, participants, currentMatchId } = data;

	return (
		<div className="w-9/12 mx-auto p-4 ">
			<div className="grid md:grid-cols-5 gap-20">
				{/* Left side: Score Tracker */}
				<div className="md:col-span-2">
					<h2 className="text-3xl font-heading mb-4 text-center text-primary">
						BOT RANKINGS
					</h2>
					<Rankings schedules={allSchedules} participants={participants} />
				</div>

				{/* Right side: Schedule */}
				<div className="md:col-span-3 gap-y-4 flex flex-col">
					<h2 className="text-3xl font-heading text-center text-primary">
						MATCH SCHEDULE
					</h2>
					<div className="gap-y-4 flex flex-col">
						{schedule.matches.map((match) => (
							<MatchPreview
								key={match.id}
								match={match}
								participants={participants}
								currentMatchId={currentMatchId}
							/>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
