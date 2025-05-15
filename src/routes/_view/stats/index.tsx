import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { BotImage, BotInfo } from "./-bot-card";
import { SharedStats } from "./-shared-stats";

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

		if (!currentMatch || !evt) {
			throw redirect({ to: "/schedule" });
		}

		const participants = await context.db.participants.find((p) =>
			currentMatch?.participants.some((part) => part.id === p.id),
		);

		return {
			currentMatch,
			participants,
			rankings: evt.rankings,
			qualifyingResults: evt.qualifyingResults,
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

	const { currentMatch, participants, rankings, qualifyingResults } = data;

	return (
		<div className="h-full w-full flex flex-col justify-start items-center p-6 pb-14">
			<h2 className="mx-auto text-3xl font-heading text-center text-primary uppercase">
				{currentMatch.name}
			</h2>
			<div className="flex-1 flex gap-20 pt-10 relative items-center">
				<BotImage src={participants[0].photo} color="orange" />
				<SharedStats bot1={participants[0]} bot2={participants[1]} />
				<BotImage src={participants[1].photo} color="blue" />
			</div>
			<div className="flex-1 flex w-full mt-20 items-center">
				<BotInfo
					participant={participants[0]}
					rank={rankings.find((r) => r.id === participants[0].id)?.position}
					stats={qualifyingResults[participants[0].id]}
					color="blue"
				/>

				<div className="flex-1 text-center text-primary text-6xl font-heading">
					vs
				</div>

				<BotInfo
					participant={participants[1]}
					rank={rankings.find((r) => r.id === participants[1].id)?.position}
					stats={qualifyingResults[participants[1].id]}
					color="blue"
				/>
			</div>
		</div>
	);
}
