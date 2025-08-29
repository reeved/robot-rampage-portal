import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute, createLink, Outlet } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { Participant } from "@/db";
import { cn } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";

const getRankingsData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const events = await context.db.events.find(() => true);
		const participants = await context.db.participants.find(() => true);

		// Get the current event (assuming the first one is current)
		const currentEvent = events[0];

		if (!currentEvent) {
			throw new Error("No events found");
		}

		// Combine rankings with participant data
		const rankingsWithParticipants = currentEvent.qualifyingRankings
			.map((ranking) => {
				const participant = participants.find((p) => p.id === ranking.id);
				const qualifyingResults = currentEvent.qualifyingResults[ranking.id];

				return {
					position: ranking.position,
					participant,
					qualifyingResults,
				};
			})
			.filter((item) => item.participant?.isCompeting); // Only include participants that exist

		return {
			rankings: rankingsWithParticipants,
			event: currentEvent,
		};
	});

const RowLink = createLink(TableRow);

const rankingsQuery = queryOptions({
	queryKey: ["rankings"],
	queryFn: async () => getRankingsData(),
});

export const Route = createFileRoute("/admin/rankings")({
	component: RouteComponent,
	loader: async ({ context }) => context.queryClient.ensureQueryData(rankingsQuery),
});

function RouteComponent() {
	const { data } = useQuery(rankingsQuery);

	if (!data) {
		return <div>Loading rankings...</div>;
	}

	const { rankings } = data;

	const getPositionBadge = (position: number) => {
		if (position === 1) return <Badge className="bg-yellow-500 text-black font-bold">🥇 1st</Badge>;
		if (position === 2) return <Badge className="bg-gray-400 text-black font-bold">🥈 2nd</Badge>;
		if (position === 3) return <Badge className="bg-amber-600 text-white font-bold">🥉 3rd</Badge>;
		return <Badge variant="secondary">{position}</Badge>;
	};

	const getStatusBadge = (participant: Participant) => {
		if (participant.isDead) return <Badge variant="destructive">DEAD</Badge>;
		if (!participant.isCompeting) return <Badge variant="outline">NOT COMPETING</Badge>;
		return <Badge variant="default">ACTIVE</Badge>;
	};

	return (
		<div className="grid grid-cols-12 gap-4 h-full max-h-full overflow-hidden">
			<div className="col-span-10 h-full flex flex-col max-h-full overflow-hidden gap-y-4">
				<div>
					<div className="flex flex-row items-center gap-2">
						<SidebarTrigger />
						<h1 className="text-2xl font-bold">Event Rankings</h1>
					</div>
					<p className="text-muted-foreground">Current standings based on qualifying round performance</p>
				</div>

				<Card className="flex-1 min-h-0 flex flex-col p-0">
					<CardContent className="p-0 overflow-y-auto overflow-x-auto">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-20">Position</TableHead>
									<TableHead>Robot Name</TableHead>
									<TableHead>Record</TableHead>
									<TableHead>Score</TableHead>
									<TableHead>Wins by KO</TableHead>
									<TableHead>Wins by JD</TableHead>
									<TableHead>Wins by NS</TableHead>
									<TableHead>Losses by KO</TableHead>
									<TableHead>Losses by JD</TableHead>
									<TableHead>Losses by NS</TableHead>
									<TableHead>Opponent Wins</TableHead>
									<TableHead>Status</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{rankings.map(({ position, participant, qualifyingResults }) => {
									if (!participant) return null;

									return (
										<RowLink
											to={"/admin/rankings/$id"}
											params={{ id: participant.id }}
											key={participant.id}
											className={cn(
												"cursor-pointer",
												participant.isDead && "opacity-50",
												!participant.isCompeting && "opacity-75",
											)}
										>
											<TableCell className="font-bold">{getPositionBadge(position)}</TableCell>
											<TableCell className="font-semibold">
												<div className="flex items-center gap-3">
													{participant.photo && (
														<img
															src={`/${participant.photo}`}
															alt={participant.name}
															className="w-8 h-8 rounded-full object-cover"
														/>
													)}
													{participant.name}
												</div>
											</TableCell>

											<TableCell>
												<span className="font-mono">
													{qualifyingResults ? (
														<>
															<span className="text-green-600 font-bold">{qualifyingResults.wins}W</span>
															{" - "}
															<span className="text-red-600 font-bold">{qualifyingResults.losses}L</span>
														</>
													) : (
														"0W - 0L"
													)}
												</span>
											</TableCell>
											<TableCell className="text-center font-mono">
												{qualifyingResults?.score?.toFixed(5) || "0.00000"}
											</TableCell>
											<TableCell className="text-center">{qualifyingResults?.winsByKO || 0}</TableCell>
											<TableCell className="text-center">{qualifyingResults?.winsByJD || 0}</TableCell>
											<TableCell className="text-center">{qualifyingResults?.winsByNS || 0}</TableCell>
											<TableCell className="text-center">{qualifyingResults?.lossesByKO || 0}</TableCell>
											<TableCell className="text-center">{qualifyingResults?.lossesByJD || 0}</TableCell>
											<TableCell className="text-center">{qualifyingResults?.lossesByNS || 0}</TableCell>
											<TableCell className="text-center">{qualifyingResults?.opponentWins || 0}</TableCell>
											<TableCell>{getStatusBadge(participant)}</TableCell>
										</RowLink>
									);
								})}
							</TableBody>
						</Table>
					</CardContent>
				</Card>
			</div>
			<Outlet />
		</div>
	);
}
