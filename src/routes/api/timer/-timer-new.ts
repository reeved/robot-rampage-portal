interface TimerState {
	duration: number;
	timeLeft: number;
	isRunning: boolean;
	isCountingDown: boolean;
	countdownPhase: "pre" | "main" | "done";
	countdownText: string | null;
	preCountdownTime: number;
}

class TimerClass {
	private state: TimerState;
	private intervalId: NodeJS.Timeout | null = null;
	private lastTick: number = 0;

	constructor() {
		this.state = {
			duration: 0,
			timeLeft: 0,
			isRunning: false,
			isCountingDown: false,
			countdownPhase: "done",
			countdownText: null,
			preCountdownTime: 0,
		};
	}

	private tick = () => {
		const now = performance.now();
		const delta = (now - this.lastTick) / 1000; // Convert to seconds
		this.lastTick = now;

		if (this.state.isCountingDown && this.state.countdownPhase === "pre") {
			const countdownSequence = ["3", "2", "1", "FIGHT"];
			this.state.preCountdownTime -= delta;
			const currentIndex = Math.floor((3 - this.state.preCountdownTime) / 1);

			if (currentIndex < countdownSequence.length) {
				this.state.countdownText = countdownSequence[currentIndex];
			} else {
				this.state.countdownPhase = "main";
				this.state.countdownText = null;
				this.state.isCountingDown = false;
				this.state.timeLeft = this.state.duration - 1; // Set timeLeft to duration for main phase
			}
		} else if (this.state.isRunning && this.state.countdownPhase === "main") {
			this.state.timeLeft -= delta;
			if (this.state.timeLeft <= 0) {
				this.state.timeLeft = 0;
				this.state.isRunning = false;
				this.state.countdownPhase = "done";
				if (this.intervalId) {
					clearInterval(this.intervalId);
					this.intervalId = null;
				}
			}
		}
	};

	start(duration: number, shouldCountdown: boolean): void {
		if (typeof duration !== "number" || duration <= 0) {
			throw new Error("Invalid duration");
		}

		if (this.intervalId) {
			clearInterval(this.intervalId);
		}

		this.state = {
			duration,
			timeLeft: duration, // timeLeft starts at duration
			isRunning: true,
			isCountingDown: shouldCountdown,
			countdownPhase: shouldCountdown ? "pre" : "main",
			countdownText: shouldCountdown ? "3" : null,
			preCountdownTime: shouldCountdown ? 3 : 0, // Track pre-countdown separately
		};

		this.lastTick = performance.now();
		this.intervalId = setInterval(this.tick, 10); // 10ms for high accuracy
	}

	pause(): void {
		if (!this.state.isRunning) {
			throw new Error("Timer is not running");
		}

		this.state.isRunning = false;
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}
	}

	resume(shouldCountdown: boolean): void {
		if (this.state.isRunning) {
			throw new Error("Timer is already running");
		}

		if (this.state.timeLeft <= 0 && this.state.countdownPhase === "main") {
			throw new Error("Timer has already finished");
		}

		this.state.isRunning = true;
		if (shouldCountdown) {
			this.state.isCountingDown = true;
			this.state.isCountingDown = shouldCountdown;
			this.state.countdownPhase = "pre";
			this.state.countdownText = "3";
			this.state.preCountdownTime = 3; // Track pre-countdown separately
			this.state.duration = this.state.timeLeft
		}

		this.lastTick = performance.now();
		this.intervalId = setInterval(this.tick, 10);
	}

	restart(): void {
		if (this.intervalId) {
			clearInterval(this.intervalId);
			this.intervalId = null;
		}

		this.state = {
			duration: 0,
			timeLeft: 0,
			isRunning: false,
			isCountingDown: false,
			countdownPhase: "done",
			countdownText: null,
			preCountdownTime: 0,
		};
	}

	getState(): { currentTime: number; isRunning: boolean; customMessage: string | null } {
		return {
			currentTime: Math.max(0, this.state.timeLeft),
			isRunning: this.state.isRunning,
			customMessage: this.state.countdownText,
		};
	}
}

export const Timer = new TimerClass();
