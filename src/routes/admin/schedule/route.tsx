import { Button } from "@/components/ui/button";
import type { Schedule } from "@/db";
import { cn, generateId } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import {
	Link,
	Outlet,
	createFileRoute,
	useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

export const getSchedules = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		if (!event) {
			throw new Error("Event not found");
		}

		return {
			schedules: await context.db.schedule.find(() => true),
			currentMatchId: event.currentMatchId,
		};
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
	const { schedules, currentMatchId } = Route.useLoaderData();

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
				<div className="flex flex-wrap flex-col items-center gap-2 justify-between w-full px-4">
					<h4 className="text-2xl font-bold">Schedules</h4>
					<div className="flex flex-wrap w-full gap-2">
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
						className={cn(
							"px-4 py-4 rounded-sm  self-stretch mx-4 font-bold",
							s.matches.some((m) => m.id === currentMatchId) &&
								"text-green-500",
						)}
					>
						<Link to="/admin/schedule/$id" params={{ id: s.id }}>
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
