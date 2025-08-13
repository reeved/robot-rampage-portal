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
		<div className="flex flex-col h-full justify-end gap-4">
			{bot ? (
				<div className="flex items-center justify-center flex-1 min-h-0">
					<img
						src={botDetails?.photo ? `/${botDetails.photo}` : undefined}
						className={cn(
							"max-w-9/12 max-h-full object-contain mx-auto rounded-3xl",
							teamColor === "blue" && "transform -scale-x-100",
							bot?.isDead ? "grayscale greyscale-manual" : "animate-breathing",
							teamColor === "yellow" ? "text-rryellow" : "text-rrblue",
						)}
						alt="bot-photo"
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
				</div>
			) : (
				<div className="flex-1 flex items-center justify-center" />
			)}
			<div
				className={cn(
					"text-6xl font-rubik z-20 flex items-center justify-center",
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
			<div className="h-20 flex items-center justify-center">
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

	// Create a sophisticated border effect using multiple drop-shadows
	const createBorderEffect = (): string => {
		// Create multiple drop-shadows with increasing blur radius to create a more defined border
		const shadows = [
			"drop-shadow(0 0 1px currentColor)",
			"drop-shadow(0 0 2px currentColor)",
			"drop-shadow(0 0 3px currentColor)",
			"drop-shadow(0 0 4px currentColor)",
			"drop-shadow(0 0 5px currentColor)",
			// `drop-shadow(0 0 8px currentColor)`,
			// `drop-shadow(0 0 10px currentColor)`,
			// `drop-shadow(0 0 12px currentColor)`,
			// `drop-shadow(0 0 14px currentColor)`,
			// `drop-shadow(0 0 16px currentColor)`,
		];

		return shadows.join(" ");
	};

	return (
		<img
			src={botDetails.photo ? `/${botDetails.photo}` : undefined}
			className={cn(
				"max-w-35 max-h-25 object-contain text-rrgreen",
				bot?.isDead && "greyscale-manual",
				teamColor === "blue" && "transform -scale-x-100",
				bot?.isSubbed && "text-primary",
				bot?.isDead && "text-neutral-500",
				// teamColor === "blue" ? "text-rrblue" : "text-rryellow",
			)}
			style={
				bot?.isDead
					? {} // No additional filters for dead bots - only grayscale from CSS class
					: ({
							filter: createBorderEffect(),
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
		<div className="w-full h-full grid grid-cols-1 grid-rows-[5fr_1.5fr_1fr]">
			{/* Bot info section - takes up remaining space */}
			<div className="min-h-0 flex flex-col justify-end">
				<BotInfo bot={activeBot} participants={participants} teamColor={teamColor} />
			</div>

			{/* Team name section */}
			<div
				className={cn(
					"mt-10 text-4xl font-rubik text-white flex items-center justify-center",
					teamColor === "yellow" ? "text-rryellow" : "text-rrblue",
				)}
			>
				{teamName}
			</div>

			{/* Bot previews section */}
			<div className="mx-10 flex flex-row justify-between items-center min-h-[100px]">
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
		(b) => !!b?.isDead,
	).length;

	return (
		<div className="grid grid-cols-2 h-full gap-x-40 relative pb-10 pt-25">
			<div className="absolute left-1/2 transform -translate-x-1/2 text-center text-primary font-heading mt-4 ">
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
