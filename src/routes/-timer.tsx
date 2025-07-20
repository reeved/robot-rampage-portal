import { Button } from "@/components/ui/button";
import { queryOptions, useQuery, useQueryClient } from "@tanstack/react-query";

// Define API endpoints in one place
const API_ENDPOINTS = {
	get: "/api/timer",
	start: "/api/timer/start?duration=30",
	startFrom5: "/api/timer/start?duration=5",
	pause: "/api/timer/pause",
	reset: "/api/timer/restart",
	resume: "/api/timer/resume",
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
		queryFn: () =>
			fetchTimer<{ currentTime: number; isRunning: boolean }>(
				API_ENDPOINTS.get,
			),
		refetchInterval: 50,
	});

export const TimerComponent = () => {
	const { data } = useQuery(timerQuery());
	const queryClient = useQueryClient();

	// Generic handler to avoid duplication
	const handleTimerAction = async (action: keyof typeof API_ENDPOINTS) => {
		await fetchTimer(API_ENDPOINTS[action]);
		queryClient.invalidateQueries({ queryKey: ["timer"] });
	};

	if (!data) {
		return <div>Loading...</div>;
	}

	// Format time display
	const displayTime = data.currentTime?.toFixed(1);

	// Determine button states
	const canResume = !data.isRunning && data.currentTime > 0;

	return (
		<div className="flex flex-col gap-4">
			<div className="text-4xl font-bold text-center">{displayTime}s</div>
			<div className="flex gap-4">
				<Button
					variant="default"
					onClick={() => handleTimerAction("start")}
					disabled={data.isRunning}
				>
					Start
				</Button>
				<Button
					variant="default"
					onClick={() => handleTimerAction("startFrom5")}
					disabled={data.isRunning}
				>
					Start From 5
				</Button>
				<Button
					variant="default"
					onClick={() => handleTimerAction("pause")}
					disabled={!data.isRunning}
				>
					Pause
				</Button>
				<Button
					variant="default"
					onClick={() => handleTimerAction("resume")}
					disabled={!canResume}
				>
					Resume
				</Button>
				<Button variant="default" onClick={() => handleTimerAction("reset")}>
					Reset
				</Button>
			</div>
			<div>Time remaining: {data.currentTime} seconds</div>
		</div>
	);
};
