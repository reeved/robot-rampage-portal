import { cn } from "@/lib/utils";

export type Box = {
	id: number;
	title: string;
	image?: string;
	x: number;
	y: number;
	width: number;
	height: number;
};

export type Connection = {
	from: number;
	to: number;
};

// Generate a stepped path between two boxes
const generatePath = (fromBox: Box, toBox: Box): string => {
	// Calculate center points of each box
	const fromCenterX: number = fromBox.x + fromBox.width / 2;
	const fromCenterY: number = fromBox.y + fromBox.height / 2;
	const toCenterX: number = toBox.x + toBox.width / 2;
	const toCenterY: number = toBox.y + toBox.height / 2;

	// Calculate exit and entry points based on relative positions
	let fromX: number;
	let fromY: number;
	let toX: number;
	let toY: number;

	// Determine if connection is primarily horizontal or vertical
	const isHorizontal: boolean =
		Math.abs(toCenterX - fromCenterX) > Math.abs(toCenterY - fromCenterY);

	if (isHorizontal) {
		// For horizontal connections
		if (toCenterX > fromCenterX) {
			// Target is to the right
			fromX = fromBox.x + fromBox.width;
			fromY = fromCenterY;
			toX = toBox.x;
			toY = toCenterY;
		} else {
			// Target is to the left
			fromX = fromBox.x;
			fromY = fromCenterY;
			toX = toBox.x + toBox.width;
			toY = toCenterY;
		}
	} else {
		// For vertical connections
		if (toCenterY > fromCenterY) {
			// Target is below
			fromX = fromCenterX;
			fromY = fromBox.y + fromBox.height;
			toX = toCenterX;
			toY = toBox.y;
		} else {
			// Target is above
			fromX = fromCenterX;
			fromY = fromBox.y;
			toX = toCenterX;
			toY = toBox.y + toBox.height;
		}
	}

	// Create a middle point for the stepped connector
	const middleX: number = (fromX + toX) / 2;
	const middleY: number = (fromY + toY) / 2;

	// Generate appropriate stepped path based on orientation
	if (isHorizontal) {
		return `M ${fromX} ${fromY}
            L ${middleX} ${fromY}
            L ${middleX} ${toY}
            L ${toX} ${toY}`;
	}
	return `M ${fromX} ${fromY}
            L ${fromX} ${middleY}
            L ${toX} ${middleY}
            L ${toX} ${toY}`;
};

// Define connections between boxes
const connections: Connection[] = [
	// Connect left top to middle left
	{ from: 1, to: 3 },
	// Connect left bottom to middle left
	{ from: 2, to: 3 },
	// Connect middle left to middle right
	{ from: 3, to: 4 },
	// Connect middle right to right top
	{ from: 4, to: 5 },
	// Connect middle right to right bottom
	{ from: 4, to: 6 },
];

export const Connectors = ({ boxes }: { boxes: Box[] }) => {
	return (
		<svg className="absolute top-0 left-0 w-full h-full">
			<title>Chart</title>
			{connections.map((conn, index) => {
				const fromBox = boxes.find((box) => box.id === conn.from);
				const toBox = boxes.find((box) => box.id === conn.to);

				if (!fromBox || !toBox) return null;

				const path = generatePath(fromBox, toBox);

				return (
					<g
						key={`connection-${
							// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
							index
						}`}
					>
						<path
							d={path}
							fill="none"
							stroke="white"
							strokeWidth="2"
							className="transition-all duration-300"
						/>
					</g>
				);
			})}
		</svg>
	);
};

export const Bracket = ({ boxes }: { boxes: Box[] }) => {
	return (
		<div className="relative h-[650px] p-4 w-[1380px]">
			{boxes.map((box) => (
				<div
					key={box.id}
					className={cn(
						"absolute flex items-center gap-x-2",
						box.id >= 5 ? "flex-row-reverse" : "",
					)}
					style={{
						left: box.x,
						top: box.y,
						width: box.width,
						height: box.height,
					}}
				>
					{box.image && (
						<div
							className={cn(
								"bg-white h-50 w-50 rounded-sm absolute",
								box.id >= 5 ? "-right-60" : "-left-60",
							)}
						/>
					)}
					<div className="flex-1 bg-primary h-20 w-70 border-2 border-primary shadow-md flex items-center justify-center text-2xl font-bold font-rubik text-center">
						{box.title}
					</div>
				</div>
			))}

			<Connectors boxes={boxes} />
		</div>
	);
};
