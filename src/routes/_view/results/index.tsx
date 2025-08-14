import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { Event, Participant } from "@/db";
import { cn } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";

const BotPreview = ({
	position,
	finalRankings,
	participants,
}: {
	position: number;
	finalRankings: Event["finalRankings"];
	participants: Participant[];
}) => {
	const bot = participants.find((p) => p.id === finalRankings?.find((f) => f.position === position)?.id);

	return (
		<div className="grid grid-cols-[3ch_auto_1fr] gap-6 items-center">
			<h3 className="text-2xl font-heading uppercase text-primary">{position}</h3>
			<img src={`/${bot?.photo}`} alt={bot?.name} className="object-contain h-20 max-w-20" />
			<h3
				className={cn(
					"text-2xl font-bold uppercase",
					bot?.name.length && bot?.name.length > 15 ? "text-xl" : "text-2xl",
				)}
			>
				{bot?.name}
			</h3>
		</div>
	);
};

const PodiumSpot = ({
	position,
	finalRankings,
	participants,
}: {
	position: number;
	finalRankings: Event["finalRankings"];
	participants: Participant[];
}) => {
	const positionSuffix = position === 1 ? "st" : position === 2 ? "nd" : "rd";

	const bot = participants.find((p) => p.id === finalRankings?.find((f) => f.position === position)?.id);

	return (
		<div className={cn("col-span-1 flex flex-col")}>
			<div
				className={cn(
					"relative flex-1 flex-col gap-4 text-center items-center justify-center",
					position === 1 && "text-yellow-500",
					position === 2 && "text-zinc-500",
					position === 3 && "text-[#714B28]",
				)}
			>
				<h3
					className={cn(
						"z-4 text-5xl w-full mb-4 font-heading uppercase absolute -top-15 left-1/2 -translate-x-1/2",
						bot?.name.length && bot?.name.length > 15 ? "text-4xl" : "text-5xl",
					)}
				>
					{bot?.name}
				</h3>
				{bot?.teamPhoto ? (
					<img
						src={`/${bot?.teamPhoto}`}
						alt={bot?.name}
						className="object-contain w-full h-full max-w-full max-h-105 -mb-2 z-1"
						style={{
							filter: "drop-shadow(8px -5px 3px currentColor)",
						}}
					/>
				) : (
					<div className="text-center text-muted-foreground h-105"></div>
				)}
			</div>
			<div
				className={cn(
					"z-4 text-white font-heading flex items-center justify-center uppercase shrink-0",
					position === 1 && "bg-yellow-500 h-30",
					position === 2 && "bg-zinc-500 h-24",
					position === 3 && "bg-[#714B28] h-18",
				)}
			>
				<div className="flex items-end justify-center">
					<div className="text-6xl">{position}</div>
					<div className="text-2xl">{positionSuffix}</div>
				</div>
			</div>
		</div>
	);
};

const getFinalRankings = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		const participants = await context.db.participants.find(() => true);
		return {
			finalRankings: event?.finalRankings,
			participants,
		};
	});

const finalRankingsQuery = queryOptions({
	queryKey: ["final-rankings"],
	queryFn: async () => getFinalRankings(),
	refetchInterval: 1000,
});

export const Route = createFileRoute("/_view/results/")({
	component: RouteComponent,
	loader: async ({ context }) => context.queryClient.ensureQueryData(finalRankingsQuery),
});

function RouteComponent() {
	const { data } = useQuery(finalRankingsQuery);

	if (!data) return null;
	return (
		<div className="flex flex-col h-full">
			<div className="flex items-center justify-center mx-155">
				<h2 className="text-3xl font-heading text-center text-primary uppercase">AUGUST 2025</h2>
			</div>
			<div className="flex-1 grid grid-rows-[65%_32%] mx-40">
				<div className="grid grid-cols-3 mx-30 items-end">
					<PodiumSpot position={2} finalRankings={data.finalRankings} participants={data.participants} />
					<PodiumSpot position={1} finalRankings={data.finalRankings} participants={data.participants} />
					<PodiumSpot position={3} finalRankings={data.finalRankings} participants={data.participants} />
				</div>
				<div className="bg-card rounded-lg grid grid-cols-3 p-6 gap-34">
					<div className="w-full flex flex-col justify-between">
						<BotPreview position={4} finalRankings={data.finalRankings} participants={data.participants} />
						<BotPreview position={5} finalRankings={data.finalRankings} participants={data.participants} />
						<BotPreview position={6} finalRankings={data.finalRankings} participants={data.participants} />
					</div>
					<div className="w-full flex flex-col justify-between">
						<BotPreview position={7} finalRankings={data.finalRankings} participants={data.participants} />
						<BotPreview position={8} finalRankings={data.finalRankings} participants={data.participants} />
						<BotPreview position={9} finalRankings={data.finalRankings} participants={data.participants} />
					</div>
					<div className="w-full flex flex-col justify-between">
						<BotPreview position={10} finalRankings={data.finalRankings} participants={data.participants} />
						<BotPreview position={11} finalRankings={data.finalRankings} participants={data.participants} />
						<BotPreview position={12} finalRankings={data.finalRankings} participants={data.participants} />
					</div>
				</div>
			</div>
		</div>
	);
}
