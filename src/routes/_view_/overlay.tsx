import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { BotBar } from "./-bot-bar";
import { CustomTimeText, TimeText, useTimer } from "./-timer";
import { TimerMiniPreview } from "./-timer-mini-preview";

const getMatchData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		const allSchedules = await context.db.schedule.find(() => true);

		const currentMatchId = event?.currentMatchId;
		const allMatches = allSchedules.flatMap((schedule) => schedule.matches);

		const currentMatch = allMatches.find((match) => match.id === currentMatchId);
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

export const Overlay = ({ children }: PropsWithChildren) => {
	return (
		<>
			<style>{"html, body { background: transparent !important; }"}</style>
			<div className="h-full w-full">
				<div
					className="h-[1080px] w-[1920px] relative box-border"
					// style={{
					// 	backgroundImage: "url(/arena-fight.png)",
					// 	backgroundSize: "cover",
					// 	backgroundPosition: "center",
					// 	backgroundRepeat: "no-repeat",
					// }}
				>
					{children}
				</div>
			</div>
		</>
	);
};

const isTimeAround = (time: number, currentTime: number) => {
	return time >= currentTime - 2 && time <= currentTime + 3;
};

const getComponentToShow = (forceBottombar: boolean, timeLeft: number) => {
	if (forceBottombar) {
		return "bar";
	}

	if (timeLeft === 0) {
		return "bar";
	}

	// show for the start of the match
	if (timeLeft >= 174) {
		return "bar";
	}

	// 2mins
	if (isTimeAround(120, timeLeft)) {
		return "mini-preview";
	}

	// 1min
	if (isTimeAround(60, timeLeft)) {
		return "mini-preview";
	}

	// 30s
	if (isTimeAround(30, timeLeft)) {
		return "mini-preview";
	}

	if (timeLeft <= 10) {
		return "mini-preview";
	}

	return "none";
};

export const Route = createFileRoute("/_view_/overlay")({
	component: RouteComponent,
	loader: async ({ context }) => context.queryClient.ensureQueryData(scheduleQuery),
});

function RouteComponent() {
	const { data } = useQuery(scheduleQuery);
	const { currentTime, isRunning, timeLeft, customMessage } = useTimer();

	if (!data) {
		return <Overlay />;
	}

	const { currentMatch, participants } = data;

	const componentToShow = getComponentToShow(!isRunning || !!customMessage, timeLeft);

	return (
		<Overlay>
			<AnimatePresence>
				<motion.div
					key={componentToShow}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{
						duration: 0.6,
						ease: "easeInOut",
					}}
				>
					{componentToShow === "bar" && (
						<BotBar
							currentMatch={currentMatch}
							participants={participants}
							middleContent={
								customMessage ? (
									<CustomTimeText customMessage={customMessage} />
								) : (
									<TimeText currentTime={currentTime} />
								)
							}
						/>
					)}
					{componentToShow === "mini-preview" && (
						<div className="flex items-center justify-center p-4 absolute top-10 left-10">
							<TimerMiniPreview>
								<TimeText currentTime={currentTime} />
							</TimerMiniPreview>
						</div>
					)}
				</motion.div>
			</AnimatePresence>
		</Overlay>
	);
}
