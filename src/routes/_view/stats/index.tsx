import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
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

		if (!currentMatchId) {
			return null;
		}

		const allSchedules = await context.db.schedule.find(() => true);
		const schedule = allSchedules.find((s) => s.matches.some((m) => m.id === currentMatchId));

		if (!schedule) {
			return null;
		}

		const currentMatch = schedule.matches.find((match) => match.id === currentMatchId);

		if (!currentMatch || !evt) {
			return null;
		}

		const participants = await context.db.participants.find((p) =>
			currentMatch?.participants.some((part) => part.id === p.id),
		);

		return {
			schedule,
			currentMatch,
			participants: currentMatch.participants.map((p) => participants.find((participant) => participant.id === p.id)),
			rankings: evt.qualifyingRankings,
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
	loader: async ({ context }) => context.queryClient.ensureQueryData(statsQuery),
	ssr: false,
});

function RouteComponent() {
	const { data } = useQuery(statsQuery);

	if (!data?.currentMatch) {
		return null;
	}

	const { schedule, currentMatch, participants, rankings, qualifyingResults } = data;

	return (
		<div className="h-full w-full flex flex-col justify-start items-center p-4 pb-14">
			{schedule.type !== "QUALIFYING" && (
				<h2 className="mx-auto text-3xl font-heading text-center text-primary uppercase">{currentMatch.name}</h2>
			)}
			<div className="flex-1 flex gap-10 pt-10 relative items-center">
				<BotImage src={participants[0]?.photo} color="orange" />
				<SharedStats bot1={participants[0]} bot2={participants[1]} />
				<BotImage src={participants[1]?.photo} color="blue" />
			</div>
			<div className="bg-black py-10 px-4 flex justify-center items-center mt-10">
				<BotInfo
					details={[
						{
							participant: participants[0],
							rank: rankings.find((r) => r.id === participants[0]?.id)?.position,
							stats: participants[0] && qualifyingResults[participants[0].id],
							color: "orange",
						},
						{
							participant: participants[1],
							rank: rankings.find((r) => r.id === participants[1]?.id)?.position,
							stats: participants[1] && qualifyingResults[participants[1].id],
							color: "blue",
						},
					]}
				/>
			</div>
		</div>
	);
}
