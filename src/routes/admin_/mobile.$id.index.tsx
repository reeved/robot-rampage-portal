import { Link, createFileRoute } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { getSchedule } from "../admin/schedule/$id";
import { MatchList } from "./-match-list";

export const Route = createFileRoute("/admin_/mobile/$id/")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const { schedule, participants, currentMatchId } = Route.useLoaderData();

	return (
		<div className="w-full flex flex-col gap-4 p-4">
			<Link
				to=".."
				className="flex items-center gap-2 text-sm text-primary font-heading uppercase"
			>
				<ArrowLeft /> Go back
			</Link>
			<MatchList
				schedule={schedule}
				participants={participants}
				currentMatchId={currentMatchId}
			/>
		</div>
	);
}
