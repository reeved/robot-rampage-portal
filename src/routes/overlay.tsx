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
			(p) => !!currentMatch?.participants.includes(p.id),
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
	participant1?: Participant;
	participant2?: Participant;
	winner?: Schedule["matches"][number]["winner"];
};
const Overlay = ({ participant1, participant2, winner }: Props) => {
	return (
		<>
			<style>{"html, body { background: transparent !important; }"}</style>
			<div className="h-full w-full">
				<div className="h-[1080px] w-[1920px] relative box-border">
					<div className="absolute bottom-10 left-60 right-60 flex">
						<div className="h-24 flex flex-1 bg-black/70 rounded-l-3xl items-center justify-center font-rubik text-4xl relative">
							{participant1 ? participant1.name : ""}
							{participant1 && winner?.id === participant1?.id && (
								<div className="absolute bottom-24 bg-amber-400/70 px-8 py-2 rounded-t-xl">
									Win by {winner.condition}
								</div>
							)}
						</div>
						<div className="h-24 w-[25ch] bg-primary/70" />
						<div className="h-24 flex flex-1 bg-black/70 rounded-r-3xl items-center justify-center font-rubik text-4xl relative">
							{participant2 ? participant2.name : ""}
							{participant2 && winner?.id === participant2?.id && (
								<div className="absolute bottom-24 bg-amber-400/70 px-8 py-2 rounded-t-xl">
									Win by {winner.condition}
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

	const participant1 = participants.find(
		(p) => p.id === currentMatch?.participants[0],
	);
	const participant2 = participants.find(
		(p) => p.id === currentMatch?.participants[1],
	);

	return (
		<Overlay
			participant1={participant1}
			participant2={participant2}
			winner={currentMatch?.winner?.id ? currentMatch.winner : undefined}
		/>
	);
}
