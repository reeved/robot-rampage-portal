import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BotInfo } from "./-bot-card";

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
			currentMatch?.participants.some((part) => part.id === p.id),
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
		<div className="h-full w-full flex flex-col justify-start items-center p-6 pb-14">
			<h2 className="mx-auto text-3xl font-heading text-center text-primary uppercase">
				{currentMatch.name}
			</h2>
			<div className="flex-1 flex gap-80 pt-10 relative">
				<BotInfo
					participant={participants[0]}
					rank={1}
					stats={{ wins: 2, losses: 3 }}
				/>
				<div className="absolute font-heading text-4xl text-primary top-40 left-184">
					vs
				</div>
				<BotInfo
					participant={participants[1]}
					rank={3}
					stats={{ wins: 2, losses: 3 }}
				/>
			</div>
		</div>
	);
}
