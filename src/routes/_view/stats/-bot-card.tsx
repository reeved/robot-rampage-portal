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
	participant: Participant;
	rank?: number;
	stats?: { wins: number; losses: number };
	color: "orange" | "blue";
};

export const BotInfo = ({ participant, rank, stats, color }: Props) => {
	if (!participant) {
		return null;
	}
	return (
		<div className="flex flex-5 flex-col gap-10">
			<div className="flex flex-col items-center">
				<div className="flex gap-4 text-center items-center">
					{rank && (
						<span className="bg-amber-400 mt-2 rounded-md p-4 aspect-square w-[2ch] h-[2ch] text-4xl flex items-center justify-center font-extrabold text-black">
							{rank}
						</span>
					)}
					<h3 className="font-heading text-6xl text-primary uppercase">
						{participant.name}
					</h3>
				</div>
				{stats && (
					<div className="mt-4 mb-0">
						<span className="font-bold flex gap-2 text-4xl">
							<span className="text-green-500 rounded-md w-[3ch] text-right">{`${stats.wins}W`}</span>
							<span className="w-[2ch] text-center">|</span>
							<span className="text-red-500 w-[3ch]">{`${stats.losses}L`}</span>
						</span>
					</div>
				)}
			</div>
		</div>
	);
};
