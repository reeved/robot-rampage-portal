import * as fs from "node:fs";
import { connect } from "@/db/papr";
import { env } from "@/env";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

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
	.handler(async ({ context }) => {
		// await connect();
		await context.db.user.insertOne({
			age: 12,
			firstName: `${Date.now()}`,
			lastName: "New dude",
		});
		console.log(await context.db.user.countDocuments({}));
		return readCount();
	});

const updateCount = createServerFn({ method: "POST" })
	.validator((d: number) => d)
	// .middleware([dbMiddleware])
	.handler(async ({ data, context }) => {
		// const users = await context.db.user.countDocuments({});
		// console.log("users", users);
		const count = await readCount();
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
