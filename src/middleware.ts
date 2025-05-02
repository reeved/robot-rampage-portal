import { createMiddleware } from "@tanstack/react-start";
import { eventDB, participantDB } from "./db";

export const dbMiddleware = createMiddleware().server(async ({ next }) => {
	// Pass the database context to the handler
	return next({
		context: {
			db: {
				events: eventDB,
				participants: participantDB,
			},
		},
	});
});
