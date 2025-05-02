import { createMiddleware } from "@tanstack/react-start";
import { connect } from "./db/papr";
import User from "./db/user";

let isConnected = false; // Track connection status

export const dbMiddleware = createMiddleware().server(async ({ next }) => {
	// Ensure the database connection is established
	if (!isConnected) {
		await connect();
		isConnected = true; // Set the flag to avoid reconnecting
	}

	// Pass the database context to the handler
	return next({
		context: {
			db: {
				user: User,
			},
		},
	});
});
