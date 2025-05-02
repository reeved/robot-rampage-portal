import { Button } from "@/components/ui/button";
import { dbMiddleware } from "@/middleware";
import { Outlet, createFileRoute, useRouter } from "@tanstack/react-router";
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
		<div className="flex h-full flex-1">
			<div className="w-2/10 border-r-1 border-foreground flex flex-col items-start">
				<div className="flex items-center gap-2 justify-between w-full px-4">
					<h4 className="text-2xl font-bold">Participants</h4>
					<Button variant="secondary" onClick={addNew}>
						Add new +
					</Button>
				</div>

				{participants.map((p) => (
					<button
						type="button"
						key={p.id}
						onClick={() =>
							router.navigate({
								to: "/admin/participants/$id",
								params: { id: p.id },
							})
						}
						tabIndex={0}
					>
						{p.name}
					</button>
				))}
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
