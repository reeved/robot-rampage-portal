import { createServerFn } from "@tanstack/react-start";

// Create a singleton instance that will be shared across all imports
// This ensures we're working with the same timer state for all requests
const TimerStore = {
	countdownTimer: {
		currentTime: 0,
		customMessage: "",
		isRunning: false,
	},
	// secondaryTimer: {
	// 	currentTime: 0,
	// 	customMessage: "",
	// 	isRunning: false,
	// },
	timerInterval: null as NodeJS.Timeout | null,
	// preTimerInterval: null as NodeJS.Timeout | null,
};

export { TimerStore };

// Constants
const UPDATE_INTERVAL = 100; // Update every 100ms for a smooth countdown
const TIME_DECREMENT = 0.1; // Decrement by 0.1 second for smooth countdown

/**
 * Helper function to clear any existing timer interval
 */
const clearTimerInterval = () => {
	if (TimerStore.timerInterval) {
		clearInterval(TimerStore.timerInterval);
		TimerStore.timerInterval = null;
	}
};

// const clearPreTimerInterval = () => {
// 	if (TimerStore.preTimerInterval) {
// 		clearInterval(TimerStore.preTimerInterval);
// 		TimerStore.preTimerInterval = null;
// 	}
// };

/**
 * Helper function to stop the timer
 */
const stopTimer = () => {
	console.log("STOPPING TIMER AT", TimerStore.countdownTimer.currentTime)

	TimerStore.countdownTimer.isRunning = false;
	clearTimerInterval();
};

// const startPreCountdown = (duration: number) => {
// 	// Clear any existing interval first
// 	clearPreTimerInterval();
// 	TimerStore.secondaryTimer.currentTime = duration;

// 	// Start the countdown
// 	TimerStore.preTimerInterval = setInterval(() => {
// 		if (TimerStore.secondaryTimer.currentTime > 0) {
// 			TimerStore.secondaryTimer.currentTime -= TIME_DECREMENT;
// 			// Round to one decimal place to avoid floating point issues
// 			TimerStore.countdownTimer.currentTime = Math.round(TimerStore.countdownTimer.currentTime * 10) / 10;
// 		} else {
// 			// Stop when reaching zero
// 			TimerStore.countdownTimer.currentTime = 0;
// 			stopTimer();
// 		}
// 	}, UPDATE_INTERVAL);
// };

/**
 * Helper function to start the countdown with the interval
 */
const startCountdown = () => {
	// Clear any existing interval first
	clearTimerInterval();

	// Start the countdown
	TimerStore.timerInterval = setInterval(() => {
		if (TimerStore.countdownTimer.currentTime > 0) {
			TimerStore.countdownTimer.currentTime -= TIME_DECREMENT;
			// Round to one decimal place to avoid floating point issues
			TimerStore.countdownTimer.currentTime = Math.round(TimerStore.countdownTimer.currentTime * 10) / 10;
		} else {
			// Stop when reaching zero
			TimerStore.countdownTimer.currentTime = 0;
			stopTimer();
		}
	}, UPDATE_INTERVAL);
};

export const getTimerStatus = createServerFn({
	method: "GET",
}).handler(async () => {
	return TimerStore.countdownTimer;
});

// Debug endpoint to help diagnose timer issues
export const debugTimer = createServerFn({
	method: "GET",
}).handler(async () => {
	return {
		countdownTimer: {
			currentTime: TimerStore.countdownTimer.currentTime,
			isRunning: TimerStore.countdownTimer.isRunning,
		},
		hasInterval: TimerStore.timerInterval !== null,
		nodeVersion: process.version,
		processId: process.pid,
		uptime: process.uptime(),
		memoryUsage: process.memoryUsage(),
		env: process.env.NODE_ENV,
	};
});

export const startTimer = async (duration: number, shouldCountdown: boolean) => {
	console.log("Starting timer with duration:", duration);

	// Stop any existing timers
	stopTimer();

	if (shouldCountdown) {
		await sleep(1000)
		// Start countdown sequence
		TimerStore.countdownTimer.customMessage = "3";

		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "2";
		}, 1000);

		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "1";
		}, 2000);

		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "FIGHT!";
		}, 3000);

		// Start the main timer after countdown completes (4 seconds total)
		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "";
			TimerStore.countdownTimer.isRunning = true;
			// Set the duration
			TimerStore.countdownTimer.currentTime = duration - 1;
			startCountdown();
		}, 4000);
	} else {
		console.log("A")
		// Start the main timer immediately
		TimerStore.countdownTimer.currentTime = duration
		TimerStore.countdownTimer.isRunning = true;
		startCountdown();
	}

	return TimerStore.countdownTimer;
};

export const pauseTimer = () => {
			console.log("PAUSING TIMER AT", TimerStore.countdownTimer.currentTime)

	if (TimerStore.countdownTimer.isRunning) {
		stopTimer();
	}

	return TimerStore.countdownTimer;
};

export const resetTimer = () => {
	console.log("RESETTING TIMER AT", TimerStore.countdownTimer.currentTime)
	// Stop the timer if it's running
	if (TimerStore.countdownTimer.isRunning) {
		stopTimer();
	}

	// Reset the time to 0
	TimerStore.countdownTimer.currentTime = 0;

	return TimerStore.countdownTimer;
};

async function sleep(ms: number): Promise<void> {
return new Promise(resolve => setTimeout(resolve, ms));
}

export const resumeTimer = async (shouldCountdown: boolean) => {

		// Stop any existing timers
	stopTimer();

	if (shouldCountdown) {
		// Start countdown sequence
		await sleep(1000)
		
		TimerStore.countdownTimer.customMessage = "3";

		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "2";
		}, 1000);

		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "1";
		}, 2000);

		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "FIGHT!";
		}, 3000);

		// Start the main timer after countdown completes (4 seconds total)
		setTimeout(() => {
			TimerStore.countdownTimer.customMessage = "";
			// Set the duration
			// Only resume if not already running and has time left
			if (!TimerStore.countdownTimer.isRunning && TimerStore.countdownTimer.currentTime > 0) {
				TimerStore.countdownTimer.isRunning = true;
				startCountdown();
			}
		}, 4000);
	} else {
		// Only resume if not already running and has time left
	if (!TimerStore.countdownTimer.isRunning && TimerStore.countdownTimer.currentTime > 0) {
		TimerStore.countdownTimer.isRunning = true;
		startCountdown();
	}
	}

	

	return TimerStore.countdownTimer;
};
