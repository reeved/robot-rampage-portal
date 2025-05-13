import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getStatsData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const evt = await context.db.events.findOne((e) => e.id === "may");
		const currentMatchId = evt?.currentMatchId;

		const allSchedules = await context.db.schedule.find(() => true);
		const allMatches = allSchedules.flatMap((schedule) => schedule.matches);
		const currentMatch = allMatches.find(
			(match) => match.id === currentMatchId,
		);

		if (!currentMatch) {
			throw redirect({ to: "/schedule" });
		}

		const participants = await context.db.participants.find((p) =>
			currentMatch?.participants.includes(p.id),
		);

		return {
			currentMatch,
			participants,
		};
	});

const statsQuery = queryOptions({
	queryKey: ["schedules"],
	queryFn: async () => getStatsData(),
	refetchInterval: 5000,
});

export const Route = createFileRoute("/_view/stats/")({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(statsQuery),
	ssr: false,
});

function RouteComponent() {
	const { data } = useQuery(statsQuery);

	if (!data?.currentMatch) {
		return null;
	}

	const { currentMatch, participants } = data;

	return (
		<div className="h-full w-full flex flex-col justify-start items-center pt-6">
			<h2 className="mx-auto text-3xl font-heading text-center text-primary uppercase">
				{currentMatch.name}
			</h2>
			<div className="flex-1">
				<div>{JSON.stringify(participants)}</div>
			</div>
		</div>
	);
}
