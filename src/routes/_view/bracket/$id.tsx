import type { BracketMatch, Participant } from "@/db";
import { dbMiddleware } from "@/middleware";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { type Box, Bracket } from "./-ui";

const getBracketBoxes = (botCount: 4 | 8, bracketMatches: BracketMatch[], participants: Participant[]) => {
	// Helper function to find participants for a match
	const getParticipantsForMatch = (match: BracketMatch | undefined) => {
		if (!match) return [undefined, undefined];
		return match.participants.map((p) => participants.find((participant) => participant.id === p.id));
	};

	// Helper function to check if a participant is a loser
	const isLoser = (match: BracketMatch | undefined, participant: Participant | undefined) => {
		if (!match?.winner?.id || !participant) return false;
		return match.winner.id !== participant.id;
	};

	// Helper function to create a box
	const createBox = (
		id: number,
		participant: Participant | undefined,
		orientation: "left" | "right",
		x: number,
		y: number,
		width: number,
		height: number,
		isLoser: boolean,
		showImage: boolean,
	) => ({
		id,
		orientation,
		title: participant?.name || "TBD",
		image: showImage ? participant?.photo : undefined,
		x,
		y,
		width,
		height,
		isLoser,
	});

	if (botCount === 4) {
		// For 4 bots: SF1, SF2, Final
		const [sf1, sf2, final] = ["SF1", "SF2", "Final"].map((round) =>
			bracketMatches.find((match) => match.round === round),
		);

		const [sf1Bots, sf2Bots, finalBots] = [sf1, sf2, final].map(getParticipantsForMatch);

		const columns = [70, 600, 1050, 1550] as const;
		const rows = [200, 350, 500] as const;

		const boxes: Box[] = [
			// Left side - SF1 participants
			createBox(1, sf1Bots[0], "right", columns[0], rows[0], 280, 120, isLoser(sf1, sf1Bots[0]), true),
			createBox(2, sf1Bots[1], "right", columns[0], rows[2], 280, 120, isLoser(sf1, sf1Bots[1]), true),

			// Middle - Final participants
			createBox(3, finalBots[0], "right", columns[1], rows[1], 280, 120, isLoser(final, finalBots[0]), false),
			createBox(4, finalBots[1], "left", columns[2], rows[1], 280, 120, isLoser(final, finalBots[1]), false),

			// Right side - SF2 participants
			createBox(5, sf2Bots[0], "left", columns[3], rows[0], 280, 120, isLoser(sf2, sf2Bots[0]), true),
			createBox(6, sf2Bots[1], "left", columns[3], rows[2], 280, 120, isLoser(sf2, sf2Bots[1]), true),
		];

		return boxes;
	}

	if (botCount === 8) {
		// For 8 bots: QF1, QF2, QF3, QF4, SF1, SF2, Final
		const rounds = ["QF1", "QF2", "QF3", "QF4", "SF1", "SF2", "Final"];
		const matches = rounds.map((round) => bracketMatches.find((match) => match.round === round));

		const [qf1, qf2, qf3, qf4, sf1, sf2, final] = matches;
		const [qf1Bots, qf2Bots, qf3Bots, qf4Bots, sf1Bots, sf2Bots, finalBots] = matches.map(getParticipantsForMatch);

		const columns = [70, 390, 700, 980, 1300, 1600] as const;
		const rows = [60, 150, 250, 420, 600, 700, 800] as const;

		const boxes: Box[] = [
			// Quarter Finals - Left side
			createBox(1, qf1Bots[0], "right", columns[0], rows[0], 240, 120, isLoser(qf1, qf1Bots[0]), false),
			createBox(2, qf1Bots[1], "right", columns[0], rows[2], 240, 120, isLoser(qf1, qf1Bots[1]), false),
			createBox(3, qf2Bots[0], "right", columns[0], rows[4], 240, 120, isLoser(qf2, qf2Bots[0]), false),
			createBox(4, qf2Bots[1], "right", columns[0], rows[6], 240, 120, isLoser(qf2, qf2Bots[1]), false),

			// Quarter Finals - Right side
			createBox(5, qf3Bots[0], "left", columns[5], rows[0], 240, 120, isLoser(qf3, qf3Bots[0]), false),
			createBox(6, qf3Bots[1], "left", columns[5], rows[2], 240, 120, isLoser(qf3, qf3Bots[1]), false),
			createBox(7, qf4Bots[0], "left", columns[5], rows[4], 240, 120, isLoser(qf4, qf4Bots[0]), false),
			createBox(8, qf4Bots[1], "left", columns[5], rows[6], 240, 120, isLoser(qf4, qf4Bots[1]), false),

			// Semi Finals - Left side
			createBox(9, sf1Bots[0], "right", columns[1], rows[1], 240, 120, isLoser(sf1, sf1Bots[0]), false),
			createBox(10, sf1Bots[1], "right", columns[1], rows[5], 240, 120, isLoser(sf1, sf1Bots[1]), false),

			// Semi Finals - Right side
			createBox(11, sf2Bots[0], "left", columns[4], rows[1], 240, 120, isLoser(sf2, sf2Bots[0]), false),
			createBox(12, sf2Bots[1], "left", columns[4], rows[5], 240, 120, isLoser(sf2, sf2Bots[1]), false),

			// Final
			createBox(13, finalBots[0], "right", columns[2], rows[3], 240, 120, isLoser(final, finalBots[0]), false),
			createBox(14, finalBots[1], "left", columns[3], rows[3], 240, 120, isLoser(final, finalBots[1]), false),
		];

		return boxes;
	}

	return [];
};

const getBracketMatches = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ context, data: bracketName }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		const bracketSchedules = (await context.db.schedule.find(({ type }) => type === "BRACKET")).filter(
			({ matches, type }) => type === "BRACKET" && matches.some((m) => m.bracket === bracketName),
		);
		const bracketConfig = event?.brackets.find((b) => b.name === bracketName);

		if (!bracketSchedules || !bracketConfig) {
			throw new Error("Bracket schedule not found");
		}

		const participants = await context.db.participants.find(() => true);

		const bracketMatches = bracketSchedules
			.filter((b) => b.type === "BRACKET")
			.flatMap((schedule) => schedule.matches)
			.filter((m) => m.bracket === bracketName);


		const boxes = getBracketBoxes(bracketConfig.size, bracketMatches, participants);

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
	loader: async ({ params, context }) => context.queryClient.ensureQueryData(bracketQuery(params.id)),
	ssr: false,
});

function RouteComponent() {
	const { id } = Route.useParams();
	const { data } = useQuery(bracketQuery(id));

	if (!data?.boxes) {
		return null;
	}

	const { boxes, bracketName } = data;

	return (
		<div className="relative h-full w-full flex flex-col items-center justify-start">
			<h2 className="text-3xl font-heading text-center text-primary uppercase">{bracketName} BRACKET</h2>
			<Bracket boxes={boxes} />
		</div>
	);
}
