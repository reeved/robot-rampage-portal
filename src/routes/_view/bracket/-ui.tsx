import { cn } from "@/lib/utils";

export type Box = {
	id: number;
	orientation: "left" | "right";
	title: string;
	image?: string;
	x: number;
	y: number;
	width: number;
	height: number;
	isLoser?: boolean;
	color: "orange" | "blue";
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
	const isHorizontal: boolean = Math.abs(toCenterX - fromCenterX) > Math.abs(toCenterY - fromCenterY);

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
const getConnections = (boxes: Box[]): Connection[] => {
	const boxCount = boxes.length;

	if (boxCount <= 7) {
		// 4 bot bracket connections
		return [
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
	}

	// 8 bot bracket connections
	return [
		// Quarter Finals to Semi Finals - Left side
		{ from: 1, to: 9 }, // QF1 winner to SF1
		{ from: 2, to: 9 }, // QF1 winner to SF1
		{ from: 3, to: 10 }, // QF2 winner to SF1
		{ from: 4, to: 10 }, // QF2 winner to SF1

		// Quarter Finals to Semi Finals - Right side
		{ from: 5, to: 11 }, // QF3 winner to SF2
		{ from: 6, to: 11 }, // QF3 winner to SF2
		{ from: 7, to: 12 }, // QF4 winner to SF2
		{ from: 8, to: 12 }, // QF4 winner to SF2

		// Semi Finals to Final
		{ from: 9, to: 13 }, // SF1 winner to Final
		{ from: 10, to: 13 }, // SF1 winner to Final
		{ from: 11, to: 14 }, // SF2 winner to Final
		{ from: 12, to: 14 }, // SF2 winner to Final

		{ from: 13, to: 14 }, // Final to Final
	];
};

export const Connectors = ({ boxes }: { boxes: Box[] }) => {
	const connections = getConnections(boxes);

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
						<path d={path} fill="none" stroke="white" strokeWidth="4" className="transition-all duration-300" />
					</g>
				);
			})}
		</svg>
	);
};

const BotBox = ({ box }: { box: Box }) => {
	return (
		<div
			className={cn(
				"flex-1 shadow-md flex-col items-center justify-center font-rubik uppercase text-center transition-all duration-700 ease-in-out",
				box.isLoser && "opacity-30",
			)}
		>
			<div className="bg-white/0 h-40 flex items-center justify-center p-2">
				{box.image && <img src={`/${box.image}`} alt="bot" className="max-h-40 mx-auto aspect-auto w-auto" />}
			</div>
			{box.title !== "TBD" && (
				<div
					className={cn(
						"px-2 py-2 line-clamp-2 flex items-center justify-center",
						"bg-primary",
						box.color === "orange" ? "bg-rrorange" : "bg-rrblue",
						// box.isLoser && "bg-primary/20 text-white/50",
					)}
				>
					{box.title}
				</div>
			)}
		</div>
	);
};

export const Bracket = ({ boxes }: { boxes: Box[] }) => {
	const isEightBot = boxes.length > 7;
	// const containerClass = isEightBot ? "relative h-[700px] p-4 w-[1800px]" : "relative h-[420px] p-4 w-[1550px]";

	return (
		<div className="h-7/12 w-full">
			{boxes.map((box) => (
				<div
					key={box.id}
					className={cn("absolute flex items-center gap-x-2", box.id >= 5 ? "flex-row-reverse" : "")}
					style={{
						left: box.x,
						top: box.y,
						width: box.width,
						height: box.height,
						// background: "yellow",
						// border: "1px solid red",
					}}
				>
					{/* Image containers */}
					{/* <div
						className={cn(
							"absolute",
							isEightBot ? "h-60 w-80" : "h-80 w-120",
							box.id === 1 || box.id === 5 ? "bottom-50" : "top-10",
						)}
					>
						{box.image && (
							<div className="text-primary">
								<img
									src={`/${box.image}`}
									alt="bot"
									className={cn(
										"mx-auto rounded-sm w-auto object-contain transition-all",
										box.id === 1 || (box.id === 2 && "left-10"),
										box.id === 1 || box.id === 5 ? "bottom-30" : "top-10",
										box.id >= 5 ? "transform -scale-x-100" : "",
										box.isLoser ? "greyscale-manual" : "grayscale-0 animate-breathing",
										box.title === "Blue Blur" && "w-10/12",
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
					</div> */}
					{/* Red box */}
					{/* <div
						className={cn(
							"flex-1 bg-primary shadow-md flex items-center justify-center font-rubik uppercase text-center transition-all duration-700 ease-in-out",
							isEightBot ? "text-2xl" : "text-2xl",
							box.isLoser && "bg-primary/20 text-white/50",
						)}
						style={{
							clipPath:
								box.orientation === "right"
									? "polygon(0% 0%, 90% 0%, 100% 50%, 90% 100%, 0% 100%, 0% 0%)" // Left boxes with right edge angled
									: box.orientation === "left"
										? "polygon(10% 0%, 100% 0%, 100% 100%, 10% 100%, 0% 50%, 10% 0%)" // Right boxes with left edge angled
										: "",
							height: isEightBot ? "100px" : "90px",
							width: "100%",
						}}
					>
						{box.title}
					</div> */}
					<BotBox box={box} />
				</div>
			))}
			<Connectors boxes={boxes} />
		</div>
	);
};
