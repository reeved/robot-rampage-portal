import { createMiddleware } from "@tanstack/react-start";
import { eventDB, participantDB, scheduleDB } from "./db";

export const dbMiddleware = createMiddleware({ type: "function" }).server(async ({ next }) => {
	// Pass the database context to the handler
	return next({
		context: {
			db: {
				events: eventDB,
				participants: participantDB,
				schedule: scheduleDB,
			},
		},
	});
});
