import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Separator as SeparatorComponent } from "@/components/ui/separator";
import type { Event, Match, Participant } from "@/db";
import { useIsTablet } from "@/hooks/use-mobile";
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
	toggleSelectedBot,
}: {
	bot: Participant;
	rankings: Event["qualifyingRankings"];
	stats: Event["qualifyingResults"];
	toggleSelectedBot: () => void;
}) => {
	const isTablet = useIsTablet();

	const [api, setApi] = useState<CarouselApi>();
	const qualifyingPosition = rankings.find((r) => r.id === bot.id)?.position;
	const botStats = stats[bot.id];

	useEffect(() => {
		if (!api) {
			return;
		}

		api.on("select", () => {
			toggleSelectedBot();
		});
	}, [api, toggleSelectedBot]);

	return (
		<div className="flex flex-col gap-2 items-center">
			<Carousel setApi={setApi} opts={{ loop: true, watchDrag: !isTablet }} className="flex-1 w-full h-full">
				<CarouselContent className="h-full" wrapperClassName="h-full">
					<CarouselItem className="flex flex-col gap-2 items-center">
						<img
							src={`/${bot.photo}`}
							alt={bot.name}
							className="h-20 text-primary mt-4"
							height={80}
							style={
								{
									filter: createBorderEffect(),
								} as React.CSSProperties
							}
						/>

						<div className="text-primary font-heading uppercase text-xl md:text-3xl flex items-center gap-4">
							{qualifyingPosition && (
								<span className="bg-yellow-400 w-[2ch] h-[2ch] aspect-square rounded text-black font-heading uppercase text-md flex items-center justify-center">
									{qualifyingPosition}
								</span>
							)}
							{bot.name}
						</div>
						{botStats && (
							<div className="mb-0 -mt-2">
								<span className="font-bold flex gap-2 text-lg md:text-3xl">
									<span className="text-green-500 rounded-md w-[3ch] text-right  ">{`${botStats.wins}W`}</span>
									<span className="w-[2ch] text-center">|</span>
									<span className="text-red-500 w-[3ch] text-left ">{`${botStats.losses}L`}</span>
								</span>
							</div>
						)}
						<div className="text-center uppercase text-lg md:text-3xl font-bold -mt-1">{bot.weapon}</div>
					</CarouselItem>
					<CarouselItem></CarouselItem>
				</CarouselContent>
			</Carousel>
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
		<div className={cn("flex w-full gap-2 md", isVertical && "flex-col")}>
			<div className={cn("text-lg md:text-3xl lg:text-3xl font-bold text-yellow-400 uppercase")}>{label}</div>
			<div
				className={cn(
					"text-lg md:text-3xl lg:text-3xl font-bold flex-1 whitespace-pre-wrap",
					!isVertical && "text-right",
					isUppercase && "uppercase",
				)}
			>
				{value ?? "-"}
			</div>
		</div>
	);
};

const Slide1 = ({ bot }: { bot: Participant }) => {
	return (
		<div className="flex flex-col gap-2 md:gap-6">
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
		<div className="flex flex-col gap-2 md:gap-6">
			<LabelledDetails label="Other Notes" value={bot.otherNotes} isVertical isUppercase={false} />
		</div>
	);
};

const Slide3 = ({ bot, match }: { bot: Participant; match: Match }) => {
	return (
		<div className="flex flex-col gap-2 md:gap-6">
			<LabelledDetails
				label="Match Intro"
				value={match.participants.find((p) => p.id === bot.id)?.introText ?? ""}
				isVertical
				isUppercase={false}
			/>
		</div>
	);
};

const BotInfo = ({
	bot,
	otherBot,
	match,
}: {
	bot: Participant;
	otherBot: Participant | undefined | null;
	match: Match;
}) => {
	const [api, setApi] = useState<CarouselApi>();
	const [current, setCurrent] = useState(0);
	const [count, setCount] = useState(0);
	const isTablet = useIsTablet();

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
		<Carousel opts={{ loop: true }} setApi={setApi} className="flex-1 w-full h-full flex flex-col gap-2">
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
					<div className="flex gap-10 h-full">
						<Card className="flex-1 h-full">
							<CardContent>
								<Slide1 bot={bot} />
							</CardContent>
						</Card>
						{isTablet && otherBot && (
							<Card className="flex-1 h-full">
								<CardContent>
									<Slide1 bot={otherBot} />
								</CardContent>
							</Card>
						)}
					</div>
				</CarouselItem>
				<CarouselItem className="h-full">
					<div className="flex gap-10 h-full">
						<Card className="flex-1 h-full">
							<CardContent>
								<Slide2 bot={bot} />
							</CardContent>
						</Card>
						{isTablet && otherBot && (
							<Card className="flex-1 h-full">
								<CardContent>
									<Slide2 bot={otherBot} />
								</CardContent>
							</Card>
						)}
					</div>
				</CarouselItem>
				<CarouselItem className="h-full">
					<div className="flex gap-10 h-full">
						<Card className="flex-1 h-full">
							<CardContent>
								<Slide3 bot={bot} match={match} />
							</CardContent>
						</Card>
						{isTablet && otherBot && (
							<Card className="flex-1 h-full">
								<CardContent>
									<Slide3 bot={otherBot} match={match} />
								</CardContent>
							</Card>
						)}
					</div>
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
	const isTablet = useIsTablet();

	return (
		<Card className="gap-2 p-2">
			<CardHeader className="text-center">
				<CardTitle className="text-xl md:text-3xl font-bold text-primary font-heading uppercase">{matchName}</CardTitle>
			</CardHeader>
			{!isTablet && (
				<CardContent className="flex gap-2 p-0 ">
					<Button
						className="flex-1 text-l py-2 uppercase font-bold md:text-2xl md:py-6"
						variant={selectedBot === bot1 ? "default" : "secondary"}
						onClick={() => setSelectedBot(bot1 ?? null)}
					>
						{bot1?.name ?? "TBD"}
					</Button>
					<Button
						className="flex-1 text-l py-2 uppercase font-bold md:text-2xl md:py-6"
						variant={selectedBot === bot2 ? "default" : "secondary"}
						onClick={() => setSelectedBot(bot2 ?? null)}
					>
						{bot2?.name ?? "TBD"}
					</Button>
				</CardContent>
			)}
		</Card>
	);
};

function RouteComponent() {
	const matchId = Route.useParams().matchId;
	const { schedule, participants, rankings, stats } = Route.useLoaderData();
	const match = schedule.matches.find((match) => match.id === matchId);
	const [selectedBot, setSelectedBot] = useState<Participant | null>(null);
	const isTablet = useIsTablet();

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

	const toggleSelectedBot = () => {
		if (selectedBot === bot1) {
			setSelectedBot(bot2 ?? null);
		} else {
			setSelectedBot(bot1 ?? null);
		}
	};

	const otherBot = selectedBot && (selectedBot.id === bot1?.id ? bot2 : bot1);

	return (
		<div className="flex flex-col gap-8 p-4 h-full">
			<BotSelector
				matchName={match.name}
				bot1={bot1}
				bot2={bot2}
				selectedBot={selectedBot}
				setSelectedBot={setSelectedBot}
			/>
			{selectedBot && (
				<div className={cn("grid grid-cols-1 gap-10", isTablet && "grid-cols-2")}>
					<BotPreview
						key={selectedBot.id}
						bot={selectedBot}
						toggleSelectedBot={toggleSelectedBot}
						rankings={rankings}
						stats={stats}
					/>
					{isTablet && otherBot && (
						<BotPreview
							key={otherBot.id}
							bot={otherBot}
							toggleSelectedBot={toggleSelectedBot}
							rankings={rankings}
							stats={stats}
						/>
					)}
				</div>
			)}
			{selectedBot && <BotInfo bot={selectedBot} otherBot={otherBot} match={match} />}
		</div>
	);
}
