import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dbMiddleware } from "@/middleware";
import { Link, Outlet, createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getParticipants = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const participants = await context.db.participants.find(() => true);
		return participants.sort((a, b) => a.name.localeCompare(b.name));
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
		<div className="flex h-full flex-1 overflow-hidden">
			<div className="w-3/10 border-r-1 border-foreground flex flex-col items-start gap-y-4">
				<div className="flex flex-wrap items-center gap-2 justify-between w-full px-4">
					<h4 className="text-2xl font-bold">Participants</h4>
					<Button variant="default" onClick={addNew}>
						Add new +
					</Button>
				</div>

				<div className="flex flex-col gap-y-2 w-full px-4 pb-10 overflow-y-auto">
					<h3 className="text-xl">Featherweights</h3>
					{participants
						.filter((p) => p.type === "FEATHERWEIGHT")
						.map((p) => (
							<Button
								asChild
								key={p.id}
								variant="secondary"
								className="px-4 py-4 rounded-sm  self-stretch mx-4 flex items-center gap-x-2"
							>
								<Link to="/admin/participants/$id" params={{ id: p.id }}>
									<>
										<span className="flex-1">
											{(!p.weapon || !p.weight || !p.photo || !p.builders) && (
												<Badge variant="destructive">MISSING INFO</Badge>
											)}
										</span>

										<span className="flex-1 text-center">{p.name}</span>

										<span className="flex-1 flex justify-end items-end gap-4">
											{p.isDead && <Badge variant="destructive">Dead</Badge>}

											{!p.isCompeting && <Badge variant="destructive">Not competing</Badge>}
										</span>
									</>
								</Link>
							</Button>
						))}

					<h3 className="text-xl">Heavyweights</h3>
					{participants
						.filter((p) => p.type === "HEAVYWEIGHT")
						.map((p) => (
							<Button asChild key={p.id} variant="secondary" className="px-4 py-4 rounded-sm  self-stretch mx-4">
								<Link to="/admin/participants/$id" params={{ id: p.id }}>
									<>
										{(!p.weapon || !p.weight || !p.photo || !p.builders) && <span>(*)</span>}
										{p.name}
									</>
								</Link>
							</Button>
						))}
				</div>
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
