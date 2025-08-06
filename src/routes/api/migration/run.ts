import { eventDB } from "@/db";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/migration/run").methods({
	GET: () => {
		eventDB.updateMany(() => true, {
			brackets: [
				{ name: "Championship", size: 8 },
				{ name: "Bottom 16", size: 8 },
			],
		});
		return json({ message: 'Hello "/api/migration/run"!' });
	},
});
