import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/admin_/mobile/$id/$matchId")({
	component: RouteComponent,
});

const NavHeader = () => {
	const { id, matchId } = Route.useParams();
	const matches = useMatches();
	const isOnScore = matches.some((m) => m.id.includes("score"));
	return (
		<div className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border p-4 flex items-center">
			<Button variant="outline" asChild>
				<Link to=".." className="flex items-center gap-2 text-xl text-primary font-heading uppercase py-5">
					<ArrowLeft className="size-6" strokeWidth={4} />
				</Link>
			</Button>
			<div className="flex-1" />
			<div className="flex gap-2">
				<Button className="w-24 font-heading" variant={isOnScore ? "secondary" : "default"} asChild>
					<Link to="/admin/mobile/$id/$matchId/info" params={{ id, matchId }}>
						INFO
					</Link>
				</Button>
				<Button className="w-24 font-heading" variant={isOnScore ? "default" : "secondary"} asChild>
					<Link to="/admin/mobile/$id/$matchId/score" params={{ id, matchId }}>
						SCORE
					</Link>
				</Button>
			</div>
		</div>
	);
};

function RouteComponent() {
	return (
		<div className="flex flex-col h-screen">
			<NavHeader />
			<div className="flex-1 pt-18">
				<Outlet />
			</div>
		</div>
	);
}
