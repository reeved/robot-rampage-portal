import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator as SeparatorComponent } from "@/components/ui/separator";
import type { Event, Participant } from "@/db";
import { cn, createBorderEffect } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import { getSchedule } from "@/routes/admin/schedule/$id";

const Separator = () => <SeparatorComponent className="bg-primary my-4 p-0.5" />;

const getBotRanks = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");

		return {
			rankings: event?.qualifyingRankings ?? [],
			stats: event?.qualifyingResults ?? {},
		};
	});

export const Route = createFileRoute("/admin_/mobile/$id/$matchId/info")({
	component: RouteComponent,
	loader: async ({ params }) => {
		const [schedule, rankings] = await Promise.all([
			getSchedule({ data: params.id }),
			getBotRanks({ data: params.id }),
		]);

		return {
			...schedule,
			...rankings,
		};
	},
});

const BotPreview = ({
	bot,
	rankings,
	stats,
}: {
	bot: Participant;
	rankings: Event["qualifyingRankings"];
	stats: Event["qualifyingResults"];
}) => {
	const qualifyingPosition = rankings.find((r) => r.id === bot.id)?.position;
	const botStats = stats[bot.id];

	return (
		<div className="flex flex-col gap-2 items-center">
			<img
				src={`/${bot.photo}`}
				alt={bot.name}
				className="h-20 text-primary"
				height={80}
				style={
					{
						filter: createBorderEffect(),
					} as React.CSSProperties
				}
			/>
			<div className="text-primary font-heading uppercase text-xl flex items-center gap-4">
				{qualifyingPosition && (
					<span className="bg-yellow-400 w-[2ch] h-[2ch] aspect-square rounded text-black font-heading uppercase text-md flex items-center justify-center">
						{qualifyingPosition}
					</span>
				)}
				{bot.name}
			</div>
			{botStats && (
				<div className="mb-0 -mt-2">
					<span className="font-bold flex gap-2 text-lg">
						<span className="text-green-500 rounded-md w-[3ch] text-right  ">{`${botStats.wins}W`}</span>
						<span className="w-[2ch] text-center">|</span>
						<span className="text-red-500 w-[3ch] text-left ">{`${botStats.losses}L`}</span>
					</span>
				</div>
			)}
			<div className="text-center uppercase text-lg font-bold -mt-1">{bot.weapon}</div>
		</div>
	);
};

const LabelledDetails = ({
	label,
	value,
	isVertical,
	isUppercase = true,
}: {
	label: string;
	value: string | undefined;
	isVertical?: boolean;
	isUppercase?: boolean;
}) => {
	return (
		<div className={cn("flex w-full gap-2", isVertical && "flex-col")}>
			<div className={cn("text-lg font-bold text-yellow-400 uppercase")}>{label}</div>
			<div className={cn("text-lg font-bold flex-1", !isVertical && "text-right", isUppercase && "uppercase")}>
				{value ?? "-"}
			</div>
		</div>
	);
};

const Slide1 = ({ bot }: { bot: Participant }) => {
	return (
		<div className="flex flex-col gap-2">
			<LabelledDetails label="Driver" value={bot.builders} />
			<LabelledDetails label="Town" value={bot.town} />
			<LabelledDetails label="Occupation" value={bot.occupation} />
			<Separator />
			<LabelledDetails label="Rank at last event" value={bot.previousRank} />
			<LabelledDetails label="Team Experience" value={bot.teamExperience} isVertical isUppercase={false} />
		</div>
	);
};

const Slide2 = ({ bot }: { bot: Participant }) => {
	return (
		<div className="flex flex-col gap-2">
			<LabelledDetails label="Other Notes" value={bot.otherNotes} isVertical isUppercase={false} />
		</div>
	);
};

const Slide3 = ({ bot }: { bot: Participant }) => {
	return (
		<div className="flex flex-col gap-2">
			<LabelledDetails
				label="Match Intro 1"
				value={`some random interesting thing
some random interesting thing
some random interesting thing
some random interesting thing
some random interesting thing`}
				isVertical
				isUppercase={false}
			/>
			<Separator />
			<LabelledDetails label="Match Intro 2" value={bot.matchIntros?.[2]} isVertical isUppercase={false} />
			<Separator />
			<LabelledDetails label="Match Intro 3" value={bot.matchIntros?.[3]} isVertical isUppercase={false} />
		</div>
	);
};

const BotInfo = ({ bot }: { bot: Participant }) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);

	useEffect(() => {
		if (!api) {
			return;
		}

		setCount(api.scrollSnapList().length);
		setCurrent(api.selectedScrollSnap() + 1);

		api.on("select", () => {
			setCurrent(api.selectedScrollSnap() + 1);
		});
	}, [api]);

	return (
		<Carousel setApi={setApi} className="flex-1 w-full h-full">
			<div className="-mt-4 flex items-center justify-center py-2 gap-2">
				{Array.from({ length: count }).map((_, index) => (
					<div
						// biome-ignore lint/suspicious/noArrayIndexKey: <explanation>
						key={`carousel-indicator-${index}`}
						className={cn("flex-1 h-2 rounded-full", index === current - 1 ? "bg-white" : "bg-secondary")}
					/>
				))}
			</div>
			<CarouselContent className="h-full" wrapperClassName="h-full">
				<CarouselItem className="h-full">
					<Card className="flex-1 h-full">
						<CardContent>
							<Slide1 bot={bot} />
						</CardContent>
					</Card>
				</CarouselItem>
				<CarouselItem className="h-full">
					<Card className="flex-1 h-full">
						<CardContent>
							<Slide2 bot={bot} />
						</CardContent>
					</Card>
				</CarouselItem>
				<CarouselItem className="h-full">
					<Card className="flex-1 h-full">
						<CardContent>
							<Slide3 bot={bot} />
						</CardContent>
					</Card>
				</CarouselItem>
			</CarouselContent>
		</Carousel>
	);
};

const BotSelector = ({
	matchName,
	bot1,
	bot2,
	selectedBot,
	setSelectedBot,
}: {
	matchName: string;
	bot1: Participant | undefined;
	bot2: Participant | undefined;
	selectedBot: Participant | null;
	setSelectedBot: (bot: Participant | null) => void;
}) => {
	return (
		<Card className="gap-2 p-2">
			<CardHeader className="text-center">
				<CardTitle className="text-xl font-bold text-primary font-heading uppercase">{matchName}</CardTitle>
			</CardHeader>
			<CardContent className="flex gap-2 p-0">
				<Button
					className="flex-1 text-l py-2 uppercase font-bold"
					variant={selectedBot === bot1 ? "default" : "secondary"}
					onClick={() => setSelectedBot(bot1 ?? null)}
				>
					{bot1?.name ?? "TBD"}
				</Button>
				<Button
					className="flex-1 text-l py-2 uppercase font-bold"
					variant={selectedBot === bot2 ? "default" : "secondary"}
					onClick={() => setSelectedBot(bot2 ?? null)}
				>
					{bot2?.name ?? "TBD"}
				</Button>
			</CardContent>
		</Card>
	);
};

function RouteComponent() {
	const matchId = Route.useParams().matchId;
	const { schedule, participants, rankings, stats } = Route.useLoaderData();
	const match = schedule.matches.find((match) => match.id === matchId);
	const [selectedBot, setSelectedBot] = useState<Participant | null>(null);

	// Set the selected bot after data is loaded to prevent flickering
	useEffect(() => {
		if (match && participants.length > 0) {
			const firstBot = participants.find((part) => part.id === match.participants[0]?.id);
			if (firstBot) {
				setSelectedBot(firstBot);
			}
		}
	}, [match, participants]);

	if (!match) {
		return <div>Match not found</div>;
	}

	const [bot1, bot2] = match.participants
		.map((p) => {
			return participants.find((part) => part.id === p.id);
		})
		.filter(Boolean);

	return (
		<div className="flex flex-col gap-8 p-4 h-full">
			<BotSelector
				matchName={match.name}
				bot1={bot1}
				bot2={bot2}
				selectedBot={selectedBot}
				setSelectedBot={setSelectedBot}
			/>
			{selectedBot && <BotPreview bot={selectedBot} rankings={rankings} stats={stats} />}
			{selectedBot && <BotInfo bot={selectedBot} />}
		</div>
	);
}
