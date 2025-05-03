import { Button } from "@/components/ui/button";
import { dbMiddleware } from "@/middleware";
import {
	Link,
	Outlet,
	createFileRoute,
	useRouter,
} from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getParticipants = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		return context.db.participants.find(() => true);
	});

export const Route = createFileRoute("/admin/participants")({
	component: RouteComponent,
	loader: async () => await getParticipants(),
});

function RouteComponent() {
	const router = useRouter();
	const participants = Route.useLoaderData();

	const addNew = () => router.navigate({ to: "/admin/participants/new" });

	return (
		<div className="flex h-full flex-1 ">
			<div className="w-3/10 border-r-1 border-foreground flex flex-col items-start gap-y-4">
				<div className="flex items-center gap-2 justify-between w-full px-4">
					<h4 className="text-2xl font-bold">Participants</h4>
					<Button variant="default" onClick={addNew}>
						Add new +
					</Button>
				</div>

				{participants.map((p) => (
					<Button
						asChild
						key={p.id}
						variant="secondary"
						className="px-4 py-4 rounded-sm  self-stretch mx-4"
					>
						<Link to="/admin/participants/$id" params={{ id: p.id }}>
							{p.name}
						</Link>
					</Button>
				))}
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
