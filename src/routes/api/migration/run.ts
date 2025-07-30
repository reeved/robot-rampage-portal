import { participantDB } from "@/db";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/migration/run").methods({
	GET: ({ request, params }) => {
		participantDB.updateMany(() => true, { isCompeting: true });
		return json({ message: 'Hello "/api/migration/run"!' });
	},
});
