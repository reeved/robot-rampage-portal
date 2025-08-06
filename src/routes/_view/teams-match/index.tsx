import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { dbMiddleware } from "@/middleware";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getTeamsMatches = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const teamsSchedules = await context.db.schedule.find((s) => s.type === "TEAMS");

		return { teamsSchedules };
	});

export const Route = createFileRoute("/_view/teams-match/")({
	component: RouteComponent,
	loader: async () => await getTeamsMatches(),
});

function RouteComponent() {
	const { teamsSchedules } = Route.useLoaderData();

	return (
		<div className="w-full max-w-[1200px] mx-auto p-4">
			<div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{teamsSchedules.map((match) => (
					<Link key={match.id} to={"/teams-match/$id"} params={{ id: match.id }}>
						<Card className="hover:bg-muted transition-colors cursor-pointer h-full">
							<CardHeader>
								<CardTitle>{match.name}</CardTitle>
							</CardHeader>
						</Card>
					</Link>
				))}

				{teamsSchedules.length === 0 && (
					<p className="col-span-full text-center text-muted-foreground italic">No brackets available</p>
				)}
			</div>
		</div>
	);
}
