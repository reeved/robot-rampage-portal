import { Link } from "@tanstack/react-router";

export default function Header() {
	return (
		<header className="p-2 flex gap-2 bg-background text-black justify-between">
			<nav className="flex flex-row">
				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/event">Event</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/participants">Participants</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/schedule">Sessions</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/rankings">Rankings</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/timer">Timer</Link>
				</div>
				<span className="text-foreground mx-4">|</span>
				<div className="px-2 font-bold text-foreground">
					<Link to="/bracket">Bracket</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/schedule">Schedule</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/overlay">Overlay</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/admin/mini-timer">Mini Timer Overlay</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/stats">Stats</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/teams-match">Teams Match</Link>
				</div>
				<div className="px-2 font-bold text-foreground">
					<Link to="/results">Results</Link>
				</div>
			</nav>
		</header>
	);
}
