import { readdir } from "node:fs/promises";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";
import { Vmix } from "@/lib/vmix-api";

export const ServerRoute = createServerFileRoute("/api/vmix/get-replays").methods({
	GET: async () => {
		const filesInCDrive = await readdir("C:\\RRServer\\Edits");
		await Vmix.UpdateReplaysList(filesInCDrive);
		return json(filesInCDrive);
	},
});
