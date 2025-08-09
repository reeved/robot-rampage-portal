import { readdir } from "node:fs/promises";
import { json } from "@tanstack/react-start";
import { createServerFileRoute } from "@tanstack/react-start/server";

export const ServerRoute = createServerFileRoute("/api/vmix/get-replays").methods({
	GET: async () => {
		const filesInCDrive = await readdir("C:/Users/reeve/Desktop");
		return json(filesInCDrive);
	},
});
