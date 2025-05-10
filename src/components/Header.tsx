import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="p-2 flex gap-2 bg-background text-black justify-between">
			<nav className="flex flex-row">
				<div className="px-2 font-bold text-foreground">
					<Link to="/bracket">Bracket</Link>
				</div>

				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/participants">Participants</Link>
				</div>

				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/schedule">Schedule</Link>
				</div>
			</nav>
		</header>
	);
}
