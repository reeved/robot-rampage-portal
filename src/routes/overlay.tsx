import type { Participant, Schedule } from "@/db";
import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";

const getMatchData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		const allSchedules = await context.db.schedule.find(() => true);

		const currentMatchId = event?.currentMatchId;
		const allMatches = allSchedules.flatMap((schedule) => schedule.matches);

		const currentMatch = allMatches.find(
			(match) => match.id === currentMatchId,
		);
		const participants = await context.db.participants.find(
			(p) => !!currentMatch?.participants.some((part) => part.id === p.id),
		);

		return {
			currentMatch,
			participants,
		};
	});

const scheduleQuery = queryOptions({
	queryKey: ["currentMatch"],
	queryFn: async () => getMatchData(),
	refetchInterval: 2000,
});

export const Route = createFileRoute("/overlay")({
	component: RouteComponent,
	loader: async ({ context }) =>
		context.queryClient.ensureQueryData(scheduleQuery),
});

type Props = {
	participant1?: Pick<Participant, "name" | "id">;
	participant2?: Pick<Participant, "name" | "id">;
	winner?: Schedule["matches"][number]["winner"];
};
const Overlay = ({ participant1, participant2, winner }: Props) => {
	return (
		<>
			<style>{"html, body { background: transparent !important; }"}</style>
			<div className="h-full w-full">
				<div className="h-[1080px] w-[1920px] relative box-border">
					<div className="absolute bottom-10 left-60 right-60 flex">
						<div className="h-24 flex-1 relative font-rubik text-4xl ">
							<div className="h-full w-full flex bg-black rounded-l-3xl items-center justify-center  z-20 relative clip-path-left-hex">
								{participant1 ? participant1.name : ""}
							</div>
							{participant1 && winner?.id === participant1?.id && (
								<div className="absolute bottom-24 left-32 bg-amber-400 px-8 py-2 animate-slide-up z-10">
									{winner.condition ? `Win by ${winner.condition}` : "Winner"}
								</div>
							)}
						</div>
						<div className="h-24 w-[25ch] bg-primary relative">
							{/* <img
								src="/rr-logo.png"
								alt="Logo"
								className="h-8 max-w-none bottom-25 -left-15 absolute"
							/> */}
						</div>
						<div className="h-24 flex-1 relative font-rubik text-4xl">
							<div className="bg-black w-full h-full flex items-center justify-center rounded-r-3xl  z-20 relative  clip-path-right-hex">
								{participant2 ? participant2.name : ""}
							</div>
							{participant2 && winner?.id === participant2?.id && (
								<div className="absolute bottom-24 left-32 bg-amber-400 px-8 py-2 animate-slide-up z-10">
									{winner.condition ? `Win by ${winner.condition}` : "Winner"}
								</div>
							)}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

function RouteComponent() {
	const { data } = useQuery(scheduleQuery);

	if (!data) {
		return <Overlay />;
	}

	const { currentMatch, participants } = data;

	if (currentMatch?.names) {
		return (
			<Overlay
				participant1={{
					id: currentMatch.names[0],
					name: currentMatch.names[0],
				}}
				participant2={{
					id: currentMatch.names[1],
					name: currentMatch.names[1],
				}}
				// winner={currentMatch?.winner?.id ? currentMatch.winner : undefined}
			/>
		);
	}

	const participant1 = participants.find(
		(p) => p.id === currentMatch?.participants[0].id,
	);
	const participant2 = participants.find(
		(p) => p.id === currentMatch?.participants[1].id,
	);

	return (
		<Overlay
			participant1={participant1}
			participant2={participant2}
			winner={currentMatch?.winner?.id ? currentMatch.winner : undefined}
		/>
	);
}
