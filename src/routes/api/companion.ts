import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { Companion } from "@/lib/companion-api";

export const ServerRoute = createServerFileRoute("/api/companion").methods({
	GET: async () => {
		await Companion.RunMatchEndSequence();
		return json({ message: 'Hello "/api/companion"!' });
	},
});
