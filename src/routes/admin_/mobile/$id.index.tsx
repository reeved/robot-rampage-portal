import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getSchedule } from "../../admin/schedule/$id";
import { MatchList } from "./-match-list";

export const Route = createFileRoute("/admin_/mobile/$id/")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const { schedule, participants, currentMatchId } = Route.useLoaderData();

	return (
		<div className="w-full flex flex-col gap-4 p-4">
			<div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center">
				<Button variant="outline" asChild>
					<Link to=".." className="flex items-center gap-2 text-xl text-primary font-heading uppercase py-5">
						<ArrowLeft className="size-6" strokeWidth={4} />
					</Link>
				</Button>
				<div className="flex-1" />
				<div className="flex gap-2">
					<h3 className="text-xl font-bold text-primary text-right font-heading uppercase">{schedule.name}</h3>
				</div>
			</div>
			<MatchList schedule={schedule} participants={participants} currentMatchId={currentMatchId} />
		</div>
	);
}
