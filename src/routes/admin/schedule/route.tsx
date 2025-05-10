import { Button } from "@/components/ui/button";
import type { Schedule } from "@/db";
import { generateId } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import {
	Link,
	Outlet,
	createFileRoute,
	useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getSchedules = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		return context.db.schedule.find(() => true);
	});

const generateNewQualifying = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const existingQualifying = await context.db.schedule.find(
			(s) => s.type === "QUALIFYING",
		);

		const newQualifying: Schedule = {
			id: generateId("schedule"),
			type: "QUALIFYING",
			matches: [],
			name: `Qualifying Session ${existingQualifying.length + 1}`,
		};
		context.db.schedule.insert(newQualifying);
		return newQualifying;
	});

const generateNewBracket = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const existingBrackets = await context.db.schedule.find(
			(s) => s.type === "BRACKET",
		);

		const newBracket: Schedule = {
			id: generateId("schedule"),
			type: "BRACKET",
			matches: [],
			name: `Bracket ${existingBrackets.length + 1}`,
		};
		context.db.schedule.insert(newBracket);
		return newBracket;
	});

export const Route = createFileRoute("/admin/schedule")({
	component: RouteComponent,
	loader: async () => await getSchedules(),
});

function RouteComponent() {
	const router = useRouter();
	const schedules = Route.useLoaderData();

	const addNewQualifying = () => {
		generateNewQualifying();
		router.invalidate();
	};

	const addNewBracket = () => {
		generateNewBracket();
		router.invalidate();
	};

	return (
		<div className="flex h-full flex-1">
			<div className="w-2/10 border-r-1 border-foreground flex flex-col items-start gap-y-4">
				<div className="flex flex-col items-center gap-2 justify-between w-full px-4">
					<h4 className="text-2xl font-bold">Schedules</h4>
					<div className="flex w-full gap-2">
						<Button variant="default" onClick={addNewQualifying}>
							Add new Quali +
						</Button>
						<Button variant="default" onClick={addNewBracket}>
							Add new Bracket +
						</Button>
					</div>
				</div>

				{schedules.map((s) => (
					<Button
						asChild
						key={s.id}
						variant="secondary"
						className="px-4 py-4 rounded-sm  self-stretch mx-4"
					>
						<Link to="/admin/schedule/$id/view" params={{ id: s.id }}>
							{s.name}
						</Link>
					</Button>
				))}
			</div>
			<div className="flex-1 p-4">
				<Outlet />
			</div>
		</div>
	);
}
