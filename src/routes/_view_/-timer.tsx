import { Button } from "@/components/ui/button";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";

// Define API endpoints in one place
const API_ENDPOINTS = {
	get: "/api/timer",
	start: "/api/timer/start?duration=30",
	startFrom5: "/api/timer/start?duration=15",
	startFrom130: "/api/timer/start?duration=90",
	pause: "/api/timer/pause",
	reset: "/api/timer/restart",
	resume: "/api/timer/resume",
};

// Utility function to format seconds as "x:YY mins"
export const formatTimeAsMinutes = (seconds: number) => {
	if (seconds <= 0) return { minutes: "0", seconds: "00" };

	const minutes = Math.floor(seconds / 60);
	const remainingSeconds = Math.floor(seconds % 60);

	// Format seconds with leading zero if needed
	const formattedSeconds = remainingSeconds.toString().padStart(2, "0");

	return { minutes: minutes.toString(), seconds: formattedSeconds };
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

const timerQuery = () =>
	queryOptions({
		queryKey: ["timer"],
		queryFn: () => fetchTimer<{ currentTime: number; isRunning: boolean }>(API_ENDPOINTS.get),
		refetchInterval: 50,
	});

export const useTimer = (): {
	currentTime: { minutes: string; seconds: string };
	isRunning: boolean;
	timeLeft: number;
} => {
	const { data } = useQuery(timerQuery());

	if (!data) {
		return {
			currentTime: { minutes: "0", seconds: "00" },
			isRunning: false,
			timeLeft: 0,
		};
	}

	return {
		currentTime: formatTimeAsMinutes(Math.ceil(data.currentTime)),
		isRunning: data.isRunning,
		timeLeft: data.currentTime,
	};
};

export const TimeText = ({ currentTime }: { currentTime: { minutes: string; seconds: string } }) => {
	return (
		<div className="font-light font-rubik text-center flex">
			<div className="w-[1ch]">{currentTime.minutes}</div>
			<div className="w-[1ch]">:</div>
			<div className="w-[2ch]">{currentTime.seconds}</div>
		</div>
	);
};

export const TimerComponent = () => {
	const { currentTime, isRunning, timeLeft } = useTimer();
	const queryClient = useQueryClient();

	// Generic handler to avoid duplication
	const handleTimerAction = async (action: keyof typeof API_ENDPOINTS) => {
		await fetchTimer(API_ENDPOINTS[action]);
		queryClient.invalidateQueries({ queryKey: ["timer"] });
	};

	// if (!timeLeft) {
	// 	return <div>Loading...</div>;
	// }

	// Determine button states
	const canResume = !isRunning && timeLeft > 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="text-4xl font-bold text-center">
				{currentTime.minutes}:{currentTime.seconds}
				<div>Time remaining: {timeLeft} seconds</div>
			</div>
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
