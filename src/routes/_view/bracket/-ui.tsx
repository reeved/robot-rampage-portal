import { cn } from "@/lib/utils";

export type Box = {
	id: number;
	title: string;
	image?: string;
	x: number;
	y: number;
	width: number;
	height: number;
	isLoser?: boolean;
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
							strokeWidth="6"
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
		<div className="relative h-[420px] p-4 w-[1550px]">
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
					<div
						className={cn(
							"absolute h-80 w-120",
							box.id === 1 || box.id === 5 ? "bottom-50" : "top-10",
						)}
					>
						{box.image && (
							<div className="text-primary">
								<img
									src={`/${box.image}`}
									alt="bot"
									className={cn(
										"mx-auto rounded-sm w-auto object-contain",
										box.id === 1 || box.id === 5 ? "bottom-30" : "top-10",
										box.id >= 5 ? "transform -scale-x-100" : "",
										box.isLoser ? "grayscale" : "animate-breathing",
									)}
									style={
										{
											// robot rampage red
											// filter: "drop-shadow(0 0 15px currentColor)",
											"--shadow-color": "currentColor",
											maxWidth: "100%", // Ensures image doesn't overflow its container
											height: "100%",
										} as React.CSSProperties
									}
								/>
							</div>
						)}
					</div>
					<div
						className={cn(
							"flex-1 bg-primary shadow-md flex items-center justify-center text-2xl font-rubik uppercase text-center transition-all duration-700 ease-in-out",
							box.isLoser && "bg-primary/20 text-white/50",
						)}
						style={{
							clipPath:
								box.id <= 3
									? "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 0% 0%)" // Right boxes with left edge angled
									: box.id >= 4
										? "polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%, 10% 0%)"
										: "",
							height: "90px",
							width: "100%",
						}}
					>
						{box.title}
					</div>
				</div>
			))}
			<Connectors boxes={boxes} />
		</div>
	);
};
