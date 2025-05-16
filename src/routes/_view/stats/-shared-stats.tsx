import { Participant } from "@/db";
import { cn } from "@/lib/utils";

const InfoRow = ({
	heading,
	valueBot1,
	valueBot2,
}: {
	heading: string;
	valueBot1: string;
	valueBot2: string;
}) => {
	return (
		<div className="flex flex-col gap-1">
			<span className="text-2xl font-semibold uppercase text-center">
				{heading}
			</span>
			<div className="flex">
				<div
					className={cn(
						"text-white w-80 bg-rrorange py-2 font-extrabold text-2xl uppercase text-center clip-path-left-hex",
						valueBot1?.length <= 20
							? "text-2xl"
							: valueBot1.length <= 25
								? "text-xl"
								: "text-lg",
					)}
				>
					{valueBot1}
				</div>
				<div
					className={cn(
						"text-white flex items-center justify-center w-80 bg-rrblue py-2 font-extrabold text-2xl uppercase text-center clip-path-right-hex",
						valueBot2?.length <= 15
							? "text-2xl"
							: valueBot2.length <= 20
								? "text-xl"
								: "text-lg",
					)}
				>
					{valueBot2}
				</div>
			</div>
		</div>
	);
};

type Props = {
	bot1: Participant;
	bot2: Participant;
};

export const SharedStats = ({ bot1, bot2 }: Props) => {
	return (
		<div className="flex flex-col gap-10 mt-10">
			<InfoRow
				heading="Team members"
				valueBot1={bot1.builders ?? "N/A"}
				valueBot2={bot2.builders ?? "N/A"}
			/>
			<InfoRow
				heading="Weapon Type"
				valueBot1={bot1.weapon || "N/A"}
				valueBot2={bot2.weapon || "N/A"}
			/>
			<InfoRow
				heading="Weight"
				valueBot1={`${bot1.weight ?? 0} KG`}
				valueBot2={`${bot2.weight ?? 0} KG`}
			/>
			<InfoRow
				heading="Rank at last event"
				valueBot1={bot1.previousRank ?? "N/A"}
				valueBot2={bot2.previousRank ?? "N/A"}
			/>

			{/* <InfoRow
				heading="Fun fact"
				valueBot1={bot1.funFact ?? "N/A"}
				valueBot2={bot2.funFact ?? "N/A"}
			/> */}
		</div>
	);
};
