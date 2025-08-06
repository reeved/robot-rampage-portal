import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dbMiddleware } from "@/middleware";
import { Link, Outlet, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getSchedules = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		return context.db.schedule.find(() => true);
	});

export const Route = createFileRoute("/_view/schedule/")({
	component: RouteComponent,
	loader: async () => await getSchedules(),
});

function RouteComponent() {
	const schedules = Route.useLoaderData();

	return (
		<div className="w-full max-w-[1200px] mx-auto p-4">
			<div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{schedules.map((schedule) => (
					<Link key={schedule.id} to={"/schedule/$id"} params={{ id: schedule.id }}>
						<Card className="hover:bg-muted transition-colors cursor-pointer h-full">
							<CardHeader>
								<CardTitle>{schedule.name}</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-sm text-muted-foreground mb-2">
									Type: <span className="font-medium">{schedule.type}</span>
								</div>
								<div className="text-sm text-muted-foreground">
									{schedule.matches.length} {schedule.matches.length === 1 ? "match" : "matches"}
								</div>
							</CardContent>
						</Card>
					</Link>
				))}

				{schedules.length === 0 && (
					<p className="col-span-full text-center text-muted-foreground italic">No schedules available</p>
				)}
			</div>
			<Outlet />
		</div>
	);
}
