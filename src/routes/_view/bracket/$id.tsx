import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { type Box, Bracket } from "./-ui";

const getBracketMatches = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ context, data: bracketName }) => {
		const bracketSchedule = await context.db.schedule.findOne(
			({ type }) => type === "BRACKET",
		);

		if (!bracketSchedule) {
			throw new Error("Bracket schedule not found");
		}

		const participants = await context.db.participants.find(() => true);

		const bracketMatches = bracketSchedule.matches
			.filter((match) => match.type === "BRACKET")
			.filter((match) => match.bracket === bracketName);

		const sf1 = bracketMatches.find((match) => match.round === "SF1");
		const sf2 = bracketMatches.find((match) => match.round === "SF2");
		const final = bracketMatches.find((match) => match.round === "Final");

		if (!sf1 || !sf2 || !final) {
			throw new Error("Bracket matches not found");
		}

		const sf1Bots = sf1.participants.map((p) =>
			participants.find((participant) => participant.id === p.id),
		);
		const sf2Bots = sf2.participants.map((p) =>
			participants.find((participant) => participant.id === p.id),
		);
		const finalBots = final.participants.map((p) =>
			participants.find((participant) => participant.id === p.id),
		);

		const boxes: Box[] = [
			// Left vertical boxes
			{
				id: 1,
				title: sf1Bots[0]?.name || "TBD",
				image: sf1Bots[0]?.photo,
				x: 0,
				y: 0,
				width: 280,
				height: 120,
				isLoser: !!sf1.winner?.id && sf1.winner?.id !== sf1Bots[0]?.id,
			},
			{
				id: 2,
				title: sf1Bots[1]?.name || "TBD",
				image: sf1Bots[1]?.photo,
				x: 0,
				y: 250,
				width: 280,
				height: 120,
				isLoser: !!sf1.winner?.id && sf1.winner?.id !== sf1Bots[1]?.id,
			},

			// Middle horizontal boxes
			{
				id: 3,
				title: finalBots[0]?.name ?? "SF1 winner",
				x: 420,
				y: 125,
				width: 280,
				height: 120,
				isLoser: !!final.winner?.id && final.winner?.id !== finalBots[0]?.id,
			},
			{
				id: 4,
				title: finalBots[1]?.name ?? "SF2 winner",
				x: 850,
				y: 125,
				width: 280,
				height: 120,
				isLoser: !!final.winner?.id && final.winner?.id !== finalBots[1]?.id,
			},

			// Right vertical boxes
			{
				id: 5,
				title: sf2Bots[0]?.name || "TBD",
				image: sf2Bots[0]?.photo,
				x: 1280,
				y: 0,
				width: 280,
				height: 120,
				isLoser: !!sf2.winner?.id && sf2.winner?.id !== sf2Bots[0]?.id,
			},
			{
				id: 6,
				title: sf2Bots[1]?.name || "TBD",
				image: sf2Bots[1]?.photo,
				x: 1280,
				y: 250,
				width: 280,
				height: 120,
				isLoser: !!sf2.winner?.id && sf2.winner?.id !== sf2Bots[1]?.id,
			},
			{
				id: 7,
				title: sf2Bots[1]?.name || "TBD",
				image: sf2Bots[1]?.photo,
				x: 0,
				y: 125,
				width: 280,
				height: 120,
				isLoser: !!sf2.winner?.id && sf2.winner?.id !== sf2Bots[1]?.id,
			},
		];

		return { boxes, bracketName };
	});

const bracketQuery = (id: string) =>
	queryOptions({
		queryKey: ["bracket", id],
		queryFn: async () => getBracketMatches({ data: id }),
		refetchInterval: 2000,
	});

export const Route = createFileRoute("/_view/bracket/$id")({
	component: RouteComponent,
	loader: async ({ params, context }) =>
		context.queryClient.ensureQueryData(bracketQuery(params.id)),
	ssr: false,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { data } = useQuery(bracketQuery(id));

	if (!data?.boxes) {
		return null;
	}

	const { boxes, bracketName } = data;

	console.log("boxes", boxes);

	return (
		<div className="relative h-full w-full flex items-center justify-center">
			<h2 className="absolute top-4 text-3xl font-heading text-center text-primary uppercase">
				{bracketName} BRACKET
			</h2>
			<Bracket boxes={boxes} />
		</div>
	);
}
