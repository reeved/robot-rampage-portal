import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

// Define API endpoints in one place
const API_ENDPOINTS = {
	get: "/api/timer",
	start: "/api/timer/start?duration=30",
	startFrom5: "/api/timer/start?duration=15&countdown=true",
	startFrom130: "/api/timer/start?duration=126&countdown=true",
	pause: "/api/timer/pause",
	reset: "/api/timer/restart",
	resume: "/api/timer/resume",
};

const EVENT_ENDPOINTS = {
	get: "/api/timer/event",
	start: "/api/timer/event/start?duration=30",
	startFrom5: "/api/timer/event/start?duration=15",
	startFrom130: "/api/timer/event/start?duration=126",
	pause: "/api/timer/event/pause",
	reset: "/api/timer/event/restart",
	resume: "/api/timer/event/resume",
};

// Utility function to format seconds as "x:YY mins"
export const formatTimeAsMinutes = (seconds: number) => {
	if (seconds <= 0) return { minutes: "00", seconds: "00" };

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	// Format seconds with leading zero if needed
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");
	const formattedMinutes = minutes.toString().padStart(2, "0");

	return { minutes: formattedMinutes, seconds: formattedSeconds };
};

// Generic fetch function with explicit type parameter
function fetchTimer<T>(endpoint: string): Promise<T> {
	return fetch(endpoint)
		.then((res) => {
			if (!res.ok) {
				throw new Error(`Network response was not ok: ${res.status}`);
			}
			return res.json();
		})
		.then((data) => {
			return data as T;
		});
}

const timerQuery = (type: "MATCH" | "EVENT") =>
	queryOptions({
		queryKey: ["timer", type],
		queryFn: () =>
			fetchTimer<{ currentTime: number; isRunning: boolean; customMessage: string }>(
				type === "MATCH" ? API_ENDPOINTS.get : EVENT_ENDPOINTS.get,
			),
		refetchInterval: 50,
	});

export const useTimer = (
	type: "MATCH" | "EVENT",
): {
	currentTime: { minutes: string; seconds: string };
	isRunning: boolean;
	timeLeft: number;
	customMessage: string | null;
} => {
	const { data } = useQuery(timerQuery(type));

	if (!data) {
		return {
			customMessage: null,
			currentTime: { minutes: "00", seconds: "00" },
			isRunning: false,
			timeLeft: 0,
		};
	}

	return {
		currentTime: formatTimeAsMinutes(Math.ceil(data.currentTime)),
		customMessage: data.customMessage,
		isRunning: data.isRunning,
		timeLeft: data.currentTime,
	};
};

export const TimeText = ({ currentTime }: { currentTime: { minutes: string; seconds: string } }) => {
	if (currentTime.minutes === "00" && currentTime.seconds === "00") {
		return null;
	}
	return (
		<div className="font-light font-rubik text-center flex">
			<div className="w-[2ch]">{currentTime.minutes}</div>
			<div className="w-[1ch]">:</div>
			<div className="w-[2ch]">{currentTime.seconds}</div>
		</div>
	);
};

export const CustomTimeText = ({ customMessage }: { customMessage: string }) => {
	return (
		<div className="font-light font-rubik text-center flex">
			<div>{customMessage}</div>
		</div>
	);
};

const ViewTimer = ({ type }: { type: "MATCH" | "EVENT" }) => {
	const { currentTime, customMessage, isRunning, timeLeft } = useTimer(type);

	const queryClient = useQueryClient();

	// Generic handler to avoid duplication
	const handleTimerAction = async (action: keyof typeof EVENT_ENDPOINTS) => {
		await fetchTimer(type === "MATCH" ? API_ENDPOINTS[action] : EVENT_ENDPOINTS[action]);
		queryClient.invalidateQueries({ queryKey: ["timer", type] });
	};

	// Determine button states
	const canResume = !isRunning && timeLeft > 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="text-4xl font-bold text-center">
				{currentTime.minutes}:{currentTime.seconds}
				<div>Time remaining: {timeLeft} seconds</div>
				<div>Custom message: {customMessage}</div>
			</div>
			<h3>{type} Timer</h3>
			<div className="flex gap-4">
				<Button variant="default" onClick={() => handleTimerAction("start")} disabled={isRunning}>
					Start
				</Button>
				<Button variant="default" onClick={() => handleTimerAction("startFrom5")} disabled={isRunning}>
					Start From 5
				</Button>
				<Button variant="default" onClick={() => handleTimerAction("startFrom130")} disabled={isRunning}>
					Start From 1:30
				</Button>
				<Button variant="default" onClick={() => handleTimerAction("pause")} disabled={!isRunning}>
					Pause
				</Button>
				<Button variant="default" onClick={() => handleTimerAction("resume")} disabled={!canResume}>
					Resume
				</Button>
				<Button variant="default" onClick={() => handleTimerAction("reset")}>
					Reset
				</Button>
			</div>
		</div>
	);
};

export const TimerComponent = () => {
	return (
		<div className="flex flex-col gap-4">
			<ViewTimer type="EVENT" />
			<ViewTimer type="MATCH" />
		</div>
	);
};
