import type { Participant, TeamsSchedule } from "@/db";
import { cn } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

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

const getActiveBotForTeam = (bots: TeamsSchedule["team1bots"]) => Object.values(bots).find((b) => b?.id && b.isActive);

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
		<div className={cn("flex flex-col flex-1 gap-y-4", teamColor === "yellow" ? "text-rryellow" : "text-rrblue")}>
			{bot ? (
				<img
					src={botDetails?.photo ? `/${botDetails.photo}` : undefined}
					className={cn(
						"w-8/12 -mt-10 mx-auto rounded-3xl",
						teamColor === "blue" && "transform -scale-x-100",
						bot?.isDead ? "grayscale greyscale-manual" : "animate-breathing",
					)}
					alt="bot-photo"
					height={160}
					style={
						bot?.isDead
							? {}
							: ({
									filter: "drop-shadow(0 0 35px currentColor)",
									// This custom property will be used by the animation
									"--shadow-color": "currentColor",
								} as React.CSSProperties)
					}
				/>
			) : (
				<div className="h-[160px]" />
			)}
			<div className="text-6xl font-rubik -mt-20 z-20">{botDetails?.name ?? ""} </div>
			<div className="text-2xl font-heading uppercase text-white mt-4">{botDetails?.weapon ?? ""}</div>
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
			<div className="h-40 flex items-center justify-center">
				<div
					className="h-30 w-30 flex items-center justify-center bg-neutral-800 font-heading text-5xl text-center text-primary relative"
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
		<img
			src={botDetails.photo ? `/${botDetails.photo}` : undefined}
			className={cn(
				"h-40 text-rrgreen",
				bot?.isDead && "greyscale-manual",
				teamColor === "blue" && "transform -scale-x-100",
				// teamColor === "blue" ? "text-rrblue" : "text-rryellow",
			)}
			style={
				bot?.isDead
					? {}
					: ({
							filter: "drop-shadow(0 0 20px currentColor)",
							// This custom property will be used by the animation
							"--shadow-color": "currentColor",
						} as React.CSSProperties)
			}
			alt={`bot-photo-${bot?.isDead ? "dead" : "alive"}`}
		/>
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
		<div className="flex flex-col w-full">
			<BotInfo bot={activeBot} participants={participants} teamColor={teamColor} />
			<div
				className={cn("text-4xl font-rubik text-white mt-15", teamColor === "yellow" ? "text-rryellow" : "text-rrblue")}
			>
				{teamName}
			</div>
			<div className="mx-10 flex flex-row justify-between items-center">
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
	const numberOfBotsWithIds = [...Object.values(schedule.team1bots), ...Object.values(schedule.team2bots)].filter(
		(b) => b?.id,
	).length;

	return (
		<div className="flex flex-row h-full gap-x-40 relative">
			<div className="absolute left-1/2 transform -translate-x-1/2 text-center text-primary font-heading mt-4 ">
				<h3 className="text-[40px]">FIGHT {numberOfBotsWithIds - 1}</h3>
				<h3 className="text-[50px] mt-100">VS</h3>
			</div>
			<div className="flex flex-1 items-end justify-center text-center">
				<TeamInfo
					teamName={schedule.team1Name}
					bots={schedule.team1bots}
					participants={participants}
					teamColor="yellow"
				/>
			</div>
			<div className="flex flex-1 items-end justify-center text-center">
				<TeamInfo
					teamName={schedule.team2Name}
					bots={schedule.team2bots}
					participants={participants}
					teamColor="blue"
				/>
			</div>
		</div>
	);
}
