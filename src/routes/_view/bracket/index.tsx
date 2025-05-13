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
		width: 280,
		height: 120,
	},
	{
		id: 2,
		title: "Snollygoster",
		image: "imageUrl",
		x: 50,
		y: 400,
		width: 280,
		height: 120,
	},

	// Middle horizontal boxes
	{ id: 3, title: "Robot 1", x: 380, y: 240, width: 280, height: 120 },
	{ id: 4, title: "Robot 4", x: 700, y: 240, width: 280, height: 120 },

	// Right vertical boxes
	{
		id: 5,
		title: "Robot 3",
		image: "imageUrl",
		x: 1030,
		y: 50,
		width: 280,
		height: 120,
	},
	{
		id: 6,
		title: "Robot 4",
		image: "imageUrl",
		x: 1030,
		y: 400,
		width: 280,
		height: 120,
	},
];

export const Route = createFileRoute("/_view/bracket/")({
	component: RouteComponent,
	ssr: false,
});

function RouteComponent() {
	return (
		<div className="h-full w-full flex items-center justify-center">
			<h2 className="absolute top-28 text-3xl font-heading text-center text-primary">
				CHAMPIONSHIP BRACKET
			</h2>
			<Bracket boxes={boxes} />
		</div>
	);
}
