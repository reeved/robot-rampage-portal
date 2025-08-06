import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { AnimatePresence } from "motion/react";
import { motion } from "motion/react";
import type { PropsWithChildren } from "react";
import { BotBar } from "./-bot-bar";
import { TimeText, useTimer } from "./-timer";
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

const Overlay = ({ children }: PropsWithChildren) => {
	return (
		<>
			<style>{"html, body { background: transparent !important; }"}</style>
			<div className="h-full w-full">
				<div
					className="h-[1080px] w-[1920px] relative box-border"
					style={{
						backgroundImage: "url(/arena-fight.png)",
						backgroundSize: "cover",
						backgroundPosition: "center",
						backgroundRepeat: "no-repeat",
					}}
				>
					{children}
				</div>
			</div>
		</>
	);
};

const getComponentToShow = (_isRunning: boolean, timeLeft: number) => {
	if (timeLeft > 80 || timeLeft === 0) {
		return "bar";
	}

	if (timeLeft < 80 && timeLeft > 75) {
		return "mini-preview";
	}

	if (timeLeft >= 55 && timeLeft <= 65) {
		return "mini-preview";
	}

	if (timeLeft >= 25 && timeLeft <= 35) {
		return "mini-preview";
	}

	if (timeLeft < 11) {
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
	const { currentTime, isRunning, timeLeft } = useTimer();

	if (!data) {
		return <Overlay />;
	}

	const { currentMatch, participants } = data;

	const componentToShow = getComponentToShow(isRunning, timeLeft);

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
							middleContent={<TimeText currentTime={currentTime} />}
						/>
					)}
					{componentToShow === "mini-preview" && (
						<TimerMiniPreview>
							<TimeText currentTime={currentTime} />
						</TimerMiniPreview>
					)}
				</motion.div>
			</AnimatePresence>
		</Overlay>
	);
}
