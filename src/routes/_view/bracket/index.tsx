import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { dbMiddleware } from "@/middleware";
import { Link, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getBrackets = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const evt = await context.db.events.findOne((e) => e.id === "may");
		if (!evt) {
			throw new Error("Event not found");
		}

		return { brackets: evt.brackets };
	});

export const Route = createFileRoute("/_view/bracket/")({
	component: RouteComponent,
	loader: async () => await getBrackets(),
});

function RouteComponent() {
	const { brackets } = Route.useLoaderData();

	return (
		<div className="w-full max-w-[1200px] mx-auto p-4">
			<div className="mt-20 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
				{brackets.map((bracket) => (
					<Link key={bracket.name} to={"/bracket/$id"} params={{ id: bracket.name }}>
						<Card className="hover:bg-muted transition-colors cursor-pointer h-full">
							<CardHeader>
								<CardTitle>{bracket.name}</CardTitle>
								<CardDescription>{bracket.size} bots</CardDescription>
							</CardHeader>
						</Card>
					</Link>
				))}

				{brackets.length === 0 && (
					<p className="col-span-full text-center text-muted-foreground italic">No brackets available</p>
				)}
			</div>
		</div>
	);
}
