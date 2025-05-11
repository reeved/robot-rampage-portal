import { Link, createFileRoute } from "@tanstack/react-router";
import logo from "../logo.svg";

export const Route = createFileRoute("/")({
	component: App,
});

function App() {
	return (
		<div className="text-center">
			<div>Robot Rampage Portal</div>
			<Link to="/admin">Go to admin</Link>
		</div>
	);
}
