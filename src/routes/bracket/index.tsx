import { createFileRoute } from "@tanstack/react-router";
import { type Box, Bracket } from "./-ui";

const boxes: Box[] = [
	// Left vertical boxes
	{
		id: 1,
		title: "Tooth fairy",
		image: "imageUrl",
		x: 50,
		y: 50,
		width: 200,
		height: 120,
	},
	{
		id: 2,
		title: "Snollygoster",
		image: "imageUrl",
		x: 50,
		y: 400,
		width: 200,
		height: 120,
	},

	// Middle horizontal boxes
	{ id: 3, title: "Robot 1", x: 300, y: 240, width: 200, height: 120 },
	{ id: 4, title: "Robot 4", x: 550, y: 240, width: 200, height: 120 },

	// Right vertical boxes
	{
		id: 5,
		title: "Robot 3",
		image: "imageUrl",
		x: 800,
		y: 50,
		width: 200,
		height: 120,
	},
	{
		id: 6,
		title: "Robot 4",
		image: "imageUrl",
		x: 800,
		y: 400,
		width: 200,
		height: 120,
	},
];

export const Route = createFileRoute("/bracket/")({
	component: RouteComponent,
});

function RouteComponent() {
	const scaleX = window.innerWidth / 1920;
	const scaleY = window.innerHeight / 1080;

	return (
		<div
			className="h-full flex flex-col fixed-viewport"
			style={{
				transform: `scale(${scaleX}, ${scaleY})`,
			}}
		>
			<h3>Bracket</h3>
			<div className="h-full w-full p-20 flex items-center justify-center">
				<Bracket boxes={boxes} />
			</div>
		</div>
	);
}
