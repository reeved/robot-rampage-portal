import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	type Participant,
	type Schedule,
	TeamsMatchSchema,
	type TeamsSchedule,
} from "@/db";
import { cn } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";

const teamsSchema = TeamsMatchSchema.pick({
	team1bots: true,
	team2bots: true,
	team1Name: true,
	team2Name: true,
});

type TeamsSchema = z.infer<typeof teamsSchema>;

const TeamList = ({
	team,
	participants,
	form,
}: {
	team: "team1" | "team2";
	participants: Participant[];
	form: UseFormReturn<TeamsSchema>;
}) => {
	return (
		<div className="flex gap-10">
			{(["bot1", "bot2", "bot3", "bot4", "bot5"] as const).map((bot) => (
				<div key={`${team}-${bot}`} className="flex flex-col gap-2">
					<FormField
						name={`${team}bots.${bot}.id`}
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">Bot {bot.at(-1)}</FormLabel>
								<FormControl>
									<Select
										value={field.value ?? "none"}
										onValueChange={(value) => {
											field.onChange(value === "none" ? undefined : value);
										}}
									>
										<SelectTrigger
											className={cn(
												"bg-zinc-800 text-white w-[30ch]",
												field.value === "none" || field.value === undefined
													? "text-gray-400"
													: "",
											)}
										>
											<SelectValue
												placeholder={`Select bot${bot.charAt(-1)}`}
											/>
										</SelectTrigger>
										<SelectContent className="bg-zinc-800 text-white">
											<SelectItem
												value="none"
												className="font-bold text-gray-400"
											>
												-- No bot selected --
											</SelectItem>
											{participants.map((p) => (
												<SelectItem
													key={p.id}
													value={p.id}
													className="font-bold"
												>
													{p.name}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<div>
						<FormField
							name={`${team}bots.${bot}.isDead`}
							control={form.control}
							rules={{ required: false }}
							render={({ field }) => (
								<FormItem className="flex flex-row gap-2 items-center">
									<FormControl>
										<Checkbox
											checked={field.value ?? false}
											onCheckedChange={(checked) => {
												field.onChange(checked === true);
											}}
										/>
									</FormControl>
									<FormLabel className="text-sm font-normal">Is dead</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>
			))}
		</div>
	);
};

const TeamName = ({
	fieldName,
	form,
}: {
	fieldName: "team1Name" | "team2Name";
	form: UseFormReturn<TeamsSchema>;
}) => {
	return (
		<FormField
			name={fieldName}
			control={form.control}
			render={({ field }) => (
				<FormItem>
					<FormLabel>Name</FormLabel>
					<FormControl>
						<Input {...field} placeholder="Team name" />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};

const processBots = (bots: TeamsSchedule["team1bots"]) => {
	return ["bot1", "bot2", "bot3", "bot4", "bot5"].reduce(
		(acc, bot) => {
			const botData = bots[bot as keyof typeof bots];
			acc[bot as keyof typeof bots] = botData?.id
				? { ...botData, isDead: botData.isDead ?? false }
				: {};
			return acc;
		},
		{} as typeof bots,
	);
};

const updateTeamsMatch = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(teamsSchema.extend({ scheduleId: z.string() }))
	.handler(async ({ context, data }) => {
		const { scheduleId, team1Name, team2Name, team1bots, team2bots } = data;

		const schedule = await context.db.schedule.find((s) => s.id === scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		await context.db.schedule.updateOne((s) => s.id === scheduleId, {
			team1Name,
			team2Name,
			team1bots: processBots(team1bots),
			team2bots: processBots(team2bots),
		});
	});

export const TeamsMatchList = ({
	schedule,
	participants,
}: { schedule: Schedule; participants: Participant[] }) => {
	const router = useRouter();

	if (schedule.type !== "TEAMS") {
		return null;
	}

	const form = useForm<TeamsSchema>({
		defaultValues: {
			team1Name: schedule.team1Name,
			team2Name: schedule.team2Name,
			team1bots: processBots(schedule.team1bots),
			team2bots: processBots(schedule.team2bots),
		},
		resolver: zodResolver(teamsSchema),
	});

	const onSubmit = async (data: TeamsSchema) => {
		await updateTeamsMatch({
			data: {
				scheduleId: schedule.id,
				team1Name: data.team1Name,
				team2Name: data.team2Name,
				team1bots: data.team1bots,
				team2bots: data.team2bots,
			},
		});

		router.invalidate();
	};

	return (
		<div>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="p-6 gap-y-6 flex flex-col items-start bg-zinc-900 rounded-xl shadow-lg"
				>
					<TeamName fieldName="team1Name" form={form} />
					<TeamList team="team1" participants={participants} form={form} />

					<Separator className="w-full my-10" />
					<TeamName fieldName="team2Name" form={form} />
					<TeamList team="team2" participants={participants} form={form} />

					<Button type="submit" className="mt-10 w-30">
						Save
					</Button>
				</form>
			</Form>
		</div>
	);
};
