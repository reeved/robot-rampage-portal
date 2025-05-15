import type { Participant } from "@/db";
import { cn } from "@/lib/utils";

type Props = {
	participant: Participant;
	rank: number;
	stats: { wins: number; losses: number };
};

const InfoRow = ({
	heading,
	value,
}: { heading: string; value: string | undefined }) => {
	if (!value) {
		return null;
	}

	return (
		<div className="flex flex-col gap-1">
			<span className="text-amber-400 text-lg font-semibold uppercase text-center">
				{heading}
			</span>
			<span
				className={cn(
					"text-white font-extrabold text-xl uppercase text-center break-words",
					value.length > 42 ? "text-xl" : "text-2xl",
				)}
			>
				{value}
			</span>
		</div>
	);
};

export const BotInfo = ({ participant, rank, stats }: Props) => {
	if (!participant) {
		return null;
	}
	return (
		<div className="flex flex-col gap-10">
			{participant.photo ? (
				<img
					src={`/${participant.photo}`}
					className="h-70 mx-auto rounded-3xl"
					alt="bot-photo"
				/>
			) : (
				<div className="h-70 w-70 bg-white mx-auto rounded-3xl" />
			)}
			<div className="flex-1 flex flex-col p-4 bg-card rounded-3xl items-center justify-center w-[60ch]">
				<div className="flex gap-4 text-center items-center">
					<span className="bg-amber-400 rounded-md p-4 aspect-square w-[2ch] h-[2ch] text-3xl flex items-center justify-center font-extrabold text-black">
						{rank}
					</span>
					<h3 className="font-heading text-3xl text-primary uppercase">
						{participant.name}
					</h3>
				</div>
				<div className="mt-4 mb-10">
					<span className="font-bold flex gap-2 text-2xl">
						<span className="text-green-500 rounded-md w-[3ch] text-right">{`${stats.wins}W`}</span>
						<span className="w-[2ch] text-center">|</span>
						<span className="text-red-500 w-[3ch]">{`${stats.losses}L`}</span>
					</span>
				</div>
				<div className="flex-1 flex flex-col gap-8">
					<InfoRow heading="Builders" value={participant.builders} />
					<InfoRow heading="Weapon type" value={participant.weapon} />
					<InfoRow heading="Fun fact" value={participant.funFact} />
					<InfoRow
						heading="Rank at previous event"
						value={participant.previousRank}
					/>
				</div>
			</div>
		</div>
	);
};
