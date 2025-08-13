import { Outlet, createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_view/teams-match")({
	component: RouteComponent,
});

function TeamsBanner() {
	return (
		<div className="relative">
			{/* Main banner container with perspective effect */}
			<div
				className="relative bg-gray-800 border-6 border-red-500 px-8 py-2 transform shadow-2xl"
				style={{
					transform: "skewX(-20deg)",
				}}
			>
				{/* Subtle gradient overlay */}
				<div className="absolute inset-0 bg-gradient-to-br from-gray-700 to-gray-800 opacity-50" />

				{/* Text with glow effect */}
				<div className="relative z-10">
					<h1 className="text-3xl font-heading text-white tracking-wider select-none pb-2">
						<span className="text-shadow-red">TEAMS</span>
					</h1>
				</div>

				{/* 3D depth effect shadow */}
				<div className="absolute inset-0 bg-black opacity-20 transform translate-x-1 translate-y-1 -z-10" />
			</div>
		</div>
	);
}

function RouteComponent() {
	return (
		<div className="flex flex-col">
			<div className="flex items-center justify-center mx-155 mt-4">
				<div className="flex-1 h-1.5 bg-red-500 mx-4" />
				<TeamsBanner />
				<div className="flex-1 h-1.5 bg-red-500 mx-4" />
			</div>
			<div className="flex-1">
				<Outlet />
			</div>
		</div>
	);
}
