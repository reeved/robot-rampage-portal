import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { Participant, TeamsSchedule } from "@/db";
import { cn, createBorderEffect } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";

const getTeamsSchedule = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ context, data: scheduleId }) => {
		const teamsSchedule = await context.db.schedule.findOne((s) => s.id === scheduleId && s.type === "TEAMS");

		if (!teamsSchedule || teamsSchedule.type !== "TEAMS") {
			throw redirect({ to: "/teams-match" });
		}

		const participants = await context.db.participants.find(() => true);

		return {
			schedule: teamsSchedule,
			participants,
		};
	});

const scheduleQuery = (id: string) =>
	queryOptions({
		queryKey: ["teams-schedule", id],
		queryFn: async () => getTeamsSchedule({ data: id }),
		refetchInterval: 2000,
	});

export const Route = createFileRoute("/_view/teams-match/$id")({
	component: RouteComponent,
	loader: async ({ params, context }) => context.queryClient.ensureQueryData(scheduleQuery(params.id)),
	ssr: false,
});

const getActiveBotForTeam = (bots: TeamsSchedule["team1bots"]) =>
	Object.values(bots).find((b) => b?.id && b.status === "ACTIVE");

const BotInfo = ({
	bot,
	participants,
	teamColor,
}: {
	bot: TeamsSchedule["team1bots"][number] | undefined;
	participants: Participant[];
	teamColor: "yellow" | "blue";
}) => {
	const botDetails = participants.find((p) => p.id === bot?.id);

	return (
		<div className="flex flex-col h-full items-center justify-end gap-4">
			{bot ? (
				<div className="w-full flex items-center justify-center flex-1 min-h-0 max-h-[400px] overflow-visible bot-image-container">
					{botDetails?.photo ? (
						<img
							src={`/${botDetails.photo}`}
							className={cn(
								"bot-image max-w-9/12 max-h-full rounded-3xl",
								teamColor === "blue" && "transform -scale-x-100",
								bot?.status === "DEAD" ? "grayscale greyscale-manual" : "animate-breathing",
								teamColor === "yellow" ? "text-rryellow" : "text-rrblue",
							)}
							alt="bot-photo"
							style={
								bot?.status === "DEAD"
									? {}
									: ({
											filter: "drop-shadow(0 0 35px currentColor)",
											// This custom property will be used by the animation
											"--shadow-color": "currentColor",
										} as React.CSSProperties)
							}
						/>
					) : (
						<div className="h-64 w-64 flex items-center justify-center bg-neutral-800 rounded-3xl">
							<span className="text-4xl text-neutral-400">?</span>
						</div>
					)}
				</div>
			) : (
				<div className="flex-1 flex items-center justify-center min-h-[400px]" />
			)}
			<div
				className={cn(
					"max-w-[20ch] text-center text-6xl font-rubik z-20 flex items-center justify-center min-h-[80px]",
					botDetails?.name?.length && botDetails?.name?.length > 20 && "text-4xl",
					teamColor === "yellow" ? "text-rryellow" : "text-rrblue",
				)}
			>
				{botDetails?.name ?? ""}
			</div>
			<div className="text-2xl font-heading uppercase text-white flex items-center justify-center"></div>
		</div>
	);
};

const BotPreview = ({
	bot,
	participants,
	teamColor,
}: {
	bot: TeamsSchedule["team1bots"][number] | undefined;
	participants: Participant[];
	teamColor: "yellow" | "blue";
}) => {
	const botDetails = participants.find((p) => p.id === bot?.id);

	if (!botDetails) {
		return (
			<div className="h-20 w-20 flex items-center justify-center">
				<div
					className="h-20 w-20 flex items-center justify-center bg-neutral-800 font-heading text-5xl text-center text-primary relative"
					style={{
						clipPath: "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)",
					}}
				>
					?
				</div>
			</div>
		);
	}

	return (
		<div className="h-20 flex items-center justify-center bot-image-container aspect-auto!">
			{botDetails.photo ? (
				<img
					src={`/${botDetails.photo}`}
					className={cn(
						"max-w-35! max-h-25! bot-image text-rrgreen",
						bot?.status === "DEAD" && "greyscale-manual",
						teamColor === "blue" && "transform -scale-x-100",
						bot?.status === "SUBBED" && "text-primary",
						bot?.status === "DEAD" && "text-neutral-500",
						// teamColor === "blue" ? "text-rrblue" : "text-rryellow",
					)}
					style={
						bot?.status === "DEAD"
							? {} // No additional filters for dead bots - only grayscale from CSS class
							: ({
									filter: createBorderEffect(),
								} as React.CSSProperties)
					}
					alt={`bot-photo-${bot?.status === "DEAD" ? "dead" : "alive"}`}
				/>
			) : (
				<div className="h-20 w-20 flex items-center justify-center bg-neutral-800 rounded-lg">
					<span className="text-lg text-neutral-400">?</span>
				</div>
			)}
		</div>
	);
};

const TeamInfo = ({
	teamName,
	bots,
	participants,
	teamColor,
}: {
	teamName: TeamsSchedule["name"];
	bots: TeamsSchedule["team1bots"];
	participants: Participant[];
	teamColor: "yellow" | "blue";
}) => {
	const activeBot = getActiveBotForTeam(bots);

	const botIndexes = teamColor === "yellow" ? [0, 1, 2, 3, 4] : [4, 3, 2, 1, 0];

	return (
		<div className="w-full h-full teams-match-grid grid grid-cols-1">
			{/* Bot info section - takes up remaining space */}
			<div className="min-h-0 flex flex-col justify-end overflow-hidden">
				<BotInfo bot={activeBot} participants={participants} teamColor={teamColor} />
			</div>

			{/* Team name section */}
			<div
				className={cn(
					"text-4xl font-rubik text-white flex items-center justify-end min-h-0",
					teamColor === "yellow" ? "text-rryellow" : "text-rrblue",
				)}
			>
				{teamName}
			</div>

			{/* Bot previews section */}
			<div className="overflow-visible! self-center mx-10 gap-10 flex flex-row! justify-between items-center min-h-[100px] max-h-[100px]">
				{botIndexes.map((index) => (
					<BotPreview
						key={`${teamName}-${index}`}
						bot={bots[index]}
						participants={participants}
						teamColor={teamColor}
					/>
				))}
			</div>
		</div>
	);
};

function RouteComponent() {
	const { id } = Route.useParams();
	const { data } = useQuery(scheduleQuery(id));

	if (!data?.schedule) {
		return null;
	}

	const { schedule, participants } = data;
	const numberOfDeadBots = [...Object.values(schedule.team1bots), ...Object.values(schedule.team2bots)].filter(
		(b) => b?.status === "DEAD",
	).length;

	return (
		<div className="teams-match-container grid grid-cols-2 h-full gap-x-40 relative">
			<div className="absolute left-1/2 transform -translate-x-1/2 text-center text-primary font-heading mt-4 z-10">
				<h3 className="text-[40px]">FIGHT {numberOfDeadBots + 1}</h3>
				<h3 className="text-[50px] mt-100">VS</h3>
			</div>
			<TeamInfo
				teamName={schedule.team1Name}
				bots={schedule.team1bots}
				participants={participants}
				teamColor="yellow"
			/>
			<TeamInfo teamName={schedule.team2Name} bots={schedule.team2bots} participants={participants} teamColor="blue" />
		</div>
	);
}
