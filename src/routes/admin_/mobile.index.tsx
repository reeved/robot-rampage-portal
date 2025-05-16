import { cn } from "@/lib/utils";
import { Link, createFileRoute } from "@tanstack/react-router";
import { getSchedules } from "../admin/schedule/route";

export const Route = createFileRoute("/admin_/mobile/")({
	component: RouteComponent,
	loader: async () => await getSchedules(),
});

function RouteComponent() {
	const { schedules, currentMatchId } = Route.useLoaderData();

	return (
		<div className="flex flex-col p-4 gap-4">
			<h1 className="text-primary font-heading text-xl text-center">
				ROBOT RAMPAGE PORTAL
			</h1>
			{schedules.map((s) => (
				<Link
					to="/admin/mobile/$id"
					params={{ id: s.id }}
					key={s.id}
					className={cn(
						"font-medium text-xl text-center bg-card py-4 rounded-md",
						s.matches.some((m) => m.id === currentMatchId) && "text-green-500",
					)}
				>
					{s.name}
				</Link>
			))}
		</div>
	);
}
