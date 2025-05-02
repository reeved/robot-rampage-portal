import * as fs from "node:fs";
import { env } from "@/env";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const filePath = "count.txt";

async function readCount() {
	const path = env.SERVER_URL;
	console.log("path", path);
	return Number.parseInt(
		await fs.promises.readFile(filePath, "utf-8").catch(() => "0"),
	);
}

const getCount = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async () => {
		return readCount();
	});

const updateCount = createServerFn({ method: "POST" })
	.validator(z.number())
	.middleware([dbMiddleware])
	.handler(async ({ data, context }) => {
		const count = await readCount();
		await context.db.participants.insert({
			id: `${Date.now()}`,
			name: "Cool",
			builders: ["TanStack"],
		});
		await fs.promises.writeFile(filePath, `${count + data}`);
	});

export const Route = createFileRoute("/demo/start/server-funcs")({
	component: Home,
	loader: async () => await getCount(),
	staleTime: 5000,
});

function Home() {
	const router = useRouter();
	const state = Route.useLoaderData();

	return (
		<div className="p-4">
			<button
				type="button"
				onClick={() => {
					updateCount({ data: 1 }).then(() => {
						router.invalidate();
					});
				}}
				className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
			>
				Add 1 to {state}?
			</button>
		</div>
	);
}
