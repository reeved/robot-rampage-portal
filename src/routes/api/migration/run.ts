import { participantDB } from "@/db";
import { json } from "@tanstack/react-start";
import { createAPIFileRoute } from "@tanstack/react-start/api";

export const APIRoute = createAPIFileRoute("/api/migration/run")({
	GET: ({ request, params }) => {
		participantDB.updateMany(() => true, { isCompeting: true });
		return json({ message: 'Hello "/api/migration/run"!' });
	},
});
