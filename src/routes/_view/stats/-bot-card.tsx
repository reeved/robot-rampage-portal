import type { Participant } from "@/db";

export const BotImage = ({
	src,
	color,
}: { src?: string; color: "orange" | "blue" }) => {
	if (!src) {
		return <div className="h-80 w-80 bg-white mx-auto rounded-3xl" />;
	}

	return (
		<div className={color === "orange" ? "text-orange-500" : "text-blue-700"}>
			<img
				src={src ? `/${src}` : undefined}
				className="h-70 mx-auto rounded-3xl animate-breathing"
				alt="bot-photo"
				style={
					{
						filter: "drop-shadow(0 0 15px currentColor)",
						// This custom property will be used by the animation
						"--shadow-color": "currentColor",
					} as React.CSSProperties
				}
			/>
		</div>
	);
};

type Props = {
	details: Array<{
		participant: Participant;
		rank?: number;
		stats?: { wins: number; losses: number };
		color: "orange" | "blue";
	}>;
};

export const BotInfo = ({ details }: Props) => {
	const [bot1Info, bot2Info] = details;

	// if (!participant) {
	// 	return null;
	// }

	return (
		<div className="relative flex items-center gap-25">
			{/* Left Skewed Box */}
			<div className="bg-black w-[75ch] border-8 border-orange-500 text-white skew-x-[20deg] shadow-lg py-6 z-0">
				<div className="skew-x-[-20deg] text-center flex flex-col items-center">
					<div className="text-6xl  uppercase font-rubik">
						{bot1Info.participant.name}
					</div>
					{bot1Info.stats && (
						<div className="mt-4 mb-0">
							<span className="font-bold flex gap-2 text-4xl">
								<span className="text-green-500 rounded-md w-[3ch] text-right font-rubik font-extralight ">{`${bot1Info.stats.wins}W`}</span>
								<span className="w-[2ch] text-center">|</span>
								<span className="text-red-500 w-[3ch] text-left font-rubik font-extralight">{`${bot1Info.stats.losses}L`}</span>
							</span>
						</div>
					)}
				</div>
			</div>

			{/* Center Rotated Diamond */}
			<div className="absolute left-1/2 transform -translate-x-1/2 z-10">
				<div className="w-40 h-40 bg-primary rotate-45 border-8 border-black flex items-center justify-center shadow-md">
					<div className="-rotate-45 text-white text-5xl font-rubik">VS</div>
				</div>
			</div>

			{/* Right Skewed Box */}
			<div className="bg-black border-8 border-blue-700 text-white skew-x-[-20deg] shadow-lg  w-[75ch] py-6 z-0">
				<div className="skew-x-[20deg] text-center flex flex-col items-center">
					<div className="text-6xl  uppercase font-rubik">
						{bot2Info.participant.name}
					</div>
					{bot2Info.stats && (
						<div className="mt-4 mb-0">
							<span className="font-bold flex gap-2 text-4xl">
								<span className="text-green-500 rounded-md w-[3ch] text-right font-rubik font-extralight">{`${bot2Info.stats.wins}W`}</span>
								<span className="w-[2ch] text-center">|</span>
								<span className="text-red-500 w-[3ch] text-left font-rubik font-extralight">{`${bot2Info.stats.losses}L`}</span>
							</span>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};
