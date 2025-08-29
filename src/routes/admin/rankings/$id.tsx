import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";

const getParticipantInfo = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const allParticipants = await context.db.participants.find(() => true);
		const participant = allParticipants.find((p) => p.id === id);

		if (!participant) {
			return null;
		}

		const matches = (await context.db.schedule.find(({ type }) => type === "QUALIFYING")).flatMap((s) => s.matches);
		const participantMatches = matches.filter((m) => m.participants.some((p) => p.id === id));

		return { participant, matches: participantMatches, allParticipants };
	});

export const Route = createFileRoute("/admin/rankings/$id")({
	component: RouteComponent,
	loader: async ({ params }) => getParticipantInfo({ data: params.id }),
});

function RouteComponent() {
	const data = Route.useLoaderData();

	if (!data) {
		return <div>Participant not found</div>;
	}

	const { participant, matches, allParticipants } = data;

	return (
		<Card className="col-span-2 overflow-hidden">
			<CardHeader>
				<CardTitle className="text-2xl font-bold">{participant.name}</CardTitle>
			</CardHeader>
			<CardContent className="p-2">
				<h3 className="text-lg font-bold mt-10 mb-4">Matches</h3>
				{matches.length > 0 ? (
					<div className="flex flex-col gap-2">
						{matches.map((match) => {
							const bot1 = allParticipants.find((p) => p.id === match.participants[0].id);
							const bot2 = allParticipants.find((p) => p.id === match.participants[1].id);

							return (
								<Card key={match.id} className="p-0">
									<CardContent className="p-4">
										<div className="flex flex-col items-center gap-4 overflow-hidden">
											<Badge
												variant="secondary"
												className={cn("text-lg truncate", bot1 && match.winner?.id === bot1.id && "text-amber-400")}
											>
												{bot1?.name || "TBD"}
											</Badge>
											<p>vs</p>
											<Badge
												variant="secondary"
												className={cn("text-lg", bot2 && match.winner?.id === bot2.id && "text-amber-400")}
											>
												{bot2?.name || "TBD"}
											</Badge>
											<div
												className={cn(
													"flex-1 flex justify-end font-bold",
													match.winner?.id === participant.id && "text-green-500",
													match.winner?.id !== participant.id && "text-red-500",
												)}
											>
												{match.winner?.id === participant.id ? "Win by" : "Lose by"} {match.winner?.condition}
											</div>
										</div>
									</CardContent>
								</Card>
							);
						})}
					</div>
				) : (
					<div>No matches found</div>
				)}
			</CardContent>
		</Card>
	);
}
