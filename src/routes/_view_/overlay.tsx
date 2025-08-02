import type { Participant, Schedule } from "@/db";
import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import type { PropsWithChildren } from "react";
import { BotBar } from "./-bot-bar";
import { useTimer } from "./-timer";

const getMatchData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		const allSchedules = await context.db.schedule.find(() => true);

		const currentMatchId = event?.currentMatchId;
		const allMatches = allSchedules.flatMap((schedule) => schedule.matches);

		const currentMatch = allMatches.find(
			(match) => match.id === currentMatchId,
		);
		const participants = await context.db.participants.find(
			(p) => !!currentMatch?.participants.some((part) => part.id === p.id),
		);

		return {
			currentMatch,
			participants,
		};
	});

const scheduleQuery = queryOptions({
	queryKey: ["currentMatch"],
	queryFn: async () => getMatchData(),
	refetchInterval: 2000,
});

const Overlay = ({ children }: PropsWithChildren) => {
	return (
		<>
			<style>{"html, body { background: transparent !important; }"}</style>
			<div className="h-full w-full">
				<div className="h-[1080px] w-[1920px] relative box-border ">
					{children}
				</div>
			</div>
		</>
	);
};

export const Route = createFileRoute("/_view_/overlay")({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(scheduleQuery),
});

const TimeText = ({
	currentTime,
}: { currentTime: { minutes: string; seconds: string } }) => {
	return (
		<div className="text-6xl font-light font-rubik text-center flex">
			<div className="w-[1ch]">{currentTime.minutes}</div>
			<div className="w-[1ch]">:</div>
			<div className="w-[2ch]">{currentTime.seconds}</div>
		</div>
	);
};

function RouteComponent() {
	const { data } = useQuery(scheduleQuery);
	const { currentTime, isRunning } = useTimer();

	if (!data) {
		return <Overlay />;
	}

	const { currentMatch, participants } = data;

	return (
		<Overlay>
			<BotBar
				currentMatch={currentMatch}
				participants={participants}
				middleContent={<TimeText currentTime={currentTime} />}
			/>
		</Overlay>
	);
}
