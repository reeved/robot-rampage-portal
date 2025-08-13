import { Button } from "@/components/ui/button";
import { Link, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="flex flex-col gap-10 p-10">
			<div className="text-primary font-heading uppercase text-xl">Robot Rampage Portal</div>
			<Button asChild variant="secondary" className="text-4xl h-70">
				<Link to="/admin">Go to admin</Link>
			</Button>

			<Button asChild variant="secondary" className="text-4xl  h-70">
				<Link to="/admin/mobile">Go to mobile admin</Link>
			</Button>
		</div>
	);
}
