import type { Participant, Schedule } from "@/db";
import { cn } from "@/lib/utils";
import type React from "react";

const BotInfo = ({
	participant,
	winner,
	position,
}: {
	participant?: Pick<Participant, "name" | "id">;
	winner?: Schedule["matches"][number]["winner"];
	position: "left" | "right";
}) => {
	return (
		<div className="h-24 flex-1 relative font-rubik text-4xl ">
			<div
				className={cn(
					"h-full w-full flex bg-black items-center justify-center  z-20 relative border-4",
					position === "left" ? "clip-path-left-hex" : "clip-path-right-hex",
				)}
			>
				{participant ? participant.name : ""}
			</div>
			{participant && winner?.id === participant?.id && (
				<div className="absolute bottom-24 left-32 bg-amber-400 px-8 py-2 animate-slide-up z-10">
					{winner.condition ? `Win by ${winner.condition}` : "Winner"}
				</div>
			)}
		</div>
	);
};

type Props = {
	participants: Participant[];
	currentMatch?: Schedule["matches"][number];
	middleContent?: React.ReactNode;
};

export const BotBar = ({
	currentMatch,
	participants,
	middleContent,
}: Props) => {
	if (!currentMatch) {
		return (
			<div className="absolute bottom-10 left-60 right-60 flex">
				<BotInfo position="left" />
				<div className="h-24 w-[25ch] bg-primary relative" />
				<BotInfo position="right" />
			</div>
		);
	}

	const participant1 = currentMatch.names
		? { name: currentMatch.names[0], id: currentMatch.names[0] }
		: participants.find((p) => p.id === currentMatch?.participants[0].id);
	const participant2 = currentMatch.names
		? { name: currentMatch.names[1], id: currentMatch.names[1] }
		: participants.find((p) => p.id === currentMatch?.participants[1].id);

	const winner = currentMatch?.winner;

	return (
		<div className="absolute bottom-10 left-60 right-60 flex">
			<BotInfo participant={participant1} winner={winner} position="left" />
			<div className="h-24 w-[6ch] bg-primary relative grid place-items-center text-6xl font-black">
				{/* <img
								src="/rr-logo.png"
								alt="Logo"
								className="h-8 max-w-none bottom-25 -left-15 absolute"
							/> */}
				{middleContent}
			</div>
			<BotInfo participant={participant2} winner={winner} position="right" />
		</div>
	);
};
