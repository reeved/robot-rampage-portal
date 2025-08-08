import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { type Participant, type Schedule, TeamsMatchSchema, type TeamsSchedule } from "@/db";
import { cn, generateId } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import { DndContext, KeyboardSensor, PointerSensor, closestCenter, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { DevTool } from "@hookform/devtools";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { type UseFormReturn, useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { getBotVideos } from "./-queue-match-form";
import { ResultForm } from "./-result-form";

const teamsSchema = TeamsMatchSchema.pick({
	team1bots: true,
	team2bots: true,
	team1Name: true,
	team2Name: true,
});

type TeamsSchema = z.infer<typeof teamsSchema>;

interface SortableBotCardProps {
	team: "team1" | "team2";
	botIndex: number;
	participants: Participant[];
	form: UseFormReturn<TeamsSchema>;
	fieldArray: ReturnType<typeof useFieldArray<TeamsSchema, "team1bots" | "team2bots", "id">>;
}

const SortableBotCard = ({ team, botIndex, participants, form, fieldArray }: SortableBotCardProps) => {
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: `${team}-${botIndex}`,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div ref={setNodeRef} style={style} className="relative">
			<Card className="p-2 w-150 bg-zinc-800 border-zinc-700 hover:border-zinc-600 transition-colors">
				{/* Drag handle - only this area should be draggable */}
				<div
					{...attributes}
					{...listeners}
					className="absolute top-2 right-2 w-6 h-6 bg-zinc-600 rounded cursor-move flex items-center justify-center"
					title="Drag to reorder"
				>
					<svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
						<path d="M8 6h8v2H8V6zm0 5h8v2H8v-2zm0 5h8v2H8v-2z" />
					</svg>
				</div>
				<CardHeader>
					<CardTitle className="text-white text-lg">Bot {botIndex + 1}</CardTitle>
				</CardHeader>
				<CardContent className="space-y-4 flex flex-row gap-4 justify-between">
					<div className="flex flex-col gap-4">
						<FormField
							name={`${team}bots.${botIndex}.id`}
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white text-sm">Bot Selection</FormLabel>
									<FormControl>
										<Select
											value={field.value ?? "none"}
											onValueChange={(value) => {
												field.onChange(value === "none" ? undefined : value);
											}}
										>
											<SelectTrigger
												className={cn(
													"bg-zinc-700 text-white border-zinc-600",
													field.value === "none" || field.value === undefined ? "text-gray-400" : "",
												)}
											>
												<SelectValue placeholder={`Select bot ${botIndex + 1}`} />
											</SelectTrigger>
											<SelectContent className="bg-zinc-800 text-white">
												<SelectItem value="none" className="font-bold text-gray-400">
													-- No bot selected --
												</SelectItem>
												{participants.map((p) => (
													<SelectItem key={p.id} value={p.id} className="font-bold">
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

						<FormField
							name={`${team}bots.${botIndex}.videoName`}
							control={form.control}
							render={({ field }) => {
								const selectedBot = form.watch(`${team}bots.${botIndex}`);

								const { bot1Videos } = getBotVideos(participants, [{ id: selectedBot?.id }]);

								if (!bot1Videos.length || !selectedBot?.id || !selectedBot.isActive) {
									return <></>;
								}

								return (
									<FormItem>
										<FormLabel className="text-white text-sm">Bot Video</FormLabel>
										<FormControl>
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className="bg-zinc-700 text-white font-bold border-zinc-600">
													<SelectValue placeholder="Select bot video" />
												</SelectTrigger>
												<SelectContent className="bg-zinc-800 text-white">
													{bot1Videos.map((v) => (
														<SelectItem key={v} value={v} className="font-bold">
															{v}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								);
							}}
						/>
					</div>
					<div className="flex flex-col gap-4 items-center pt-2">
						<FormField
							name={`${team}bots.${botIndex}.isDead`}
							control={form.control}
							rules={{ required: false }}
							render={({ field }) => (
								<FormItem className="w-25 flex flex-row gap-2 items-center justify-start">
									<FormControl>
										<Checkbox
											checked={field.value ?? false}
											onCheckedChange={(checked) => {
												field.onChange(checked === true);
											}}
										/>
									</FormControl>
									<FormLabel className="text-sm font-normal text-white">Is dead</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name={`${team}bots.${botIndex}.isActive`}
							control={form.control}
							rules={{ required: false }}
							render={({ field }) => (
								<FormItem className="w-25 flex flex-row gap-2 items-center justify-start">
									<FormControl>
										<Checkbox
											checked={field.value ?? false}
											onCheckedChange={(checked) => {
												field.onChange(checked === true);
											}}
										/>
									</FormControl>
									<FormLabel className="text-sm font-normal text-white">Is active</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							name={`${team}bots.${botIndex}.isSubbed`}
							control={form.control}
							rules={{ required: false }}
							render={({ field }) => (
								<FormItem className="w-25 flex flex-row gap-2 items-center justify-start">
									<FormControl>
										<Checkbox
											checked={field.value ?? false}
											onCheckedChange={(checked) => {
												field.onChange(checked === true);
											}}
										/>
									</FormControl>
									<FormLabel className="text-sm font-normal text-white">Is subbed</FormLabel>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
};

const TeamList = ({
	team,
	participants,
	form,
}: {
	team: "team1" | "team2";
	participants: Participant[];
	form: UseFormReturn<TeamsSchema>;
}) => {
	const fieldArray = useFieldArray<TeamsSchema, "team1bots" | "team2bots", "id">({
		control: form.control,
		name: `${team}bots` as "team1bots" | "team2bots",
	});

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		}),
	);

	const handleDragEnd = (event: DragEndEvent) => {
		const { active, over } = event;

		console.log("Drag end event:", { active: active.id, over: over?.id });

		if (active.id !== over?.id) {
			const activeId = active.id as string;
			const overId = over?.id as string;

			// Extract team and indices from the IDs
			const [activeTeam, activeIndexStr] = activeId.split("-");
			const [overTeam, overIndexStr] = overId.split("-");

			console.log("Parsed IDs:", { activeTeam, activeIndexStr, overTeam, overIndexStr });

			if (activeTeam === overTeam && (activeTeam === "team1" || activeTeam === "team2")) {
				const activeIndex = Number.parseInt(activeIndexStr, 10);
				const overIndex = Number.parseInt(overIndexStr, 10);

				console.log("Moving from index", activeIndex, "to index", overIndex);

				// Use field array move method to properly update the array
				fieldArray.move(activeIndex, overIndex);
			}
		}
	};

	return (
		<div className="flex flex-col gap-4">
			<DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
				<SortableContext
					items={fieldArray.fields.map((_, index) => `${team}-${index}`)}
					strategy={verticalListSortingStrategy}
				>
					{fieldArray.fields.map((field, botIndex) => (
						<SortableBotCard
							key={field.id}
							team={team}
							botIndex={botIndex}
							participants={participants}
							form={form}
							fieldArray={fieldArray}
						/>
					))}
				</SortableContext>
			</DndContext>
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
	return [0, 1, 2, 3, 4].map((index) => ({
		id: undefined,
		isDead: false,
		isActive: false,
		videoName: undefined,
		...bots[index],
	}));
};

const updateTeamsMatch = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(teamsSchema.extend({ scheduleId: z.string() }))
	.handler(async ({ context, data }) => {
		const { scheduleId, team1Name, team2Name, team1bots, team2bots } = data;

		console.log(data);

		const schedule = await context.db.schedule.find((s) => s.id === scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		const matchId = generateId("teams-match");

		const team1ActiveBot = Object.values(team1bots).find((b) => b?.isActive);
		const team2ActiveBot = Object.values(team2bots).find((b) => b?.isActive);

		await context.db.schedule.updateOne((s) => s.id === scheduleId, {
			team1Name,
			team2Name,
			team1bots: processBots(team1bots),
			team2bots: processBots(team2bots),
			matches: [
				{
					id: matchId,
					name: "Teams match",
					participants: [
						{ id: team1ActiveBot?.id, videoName: team1ActiveBot?.videoName },
						{ id: team2ActiveBot?.id, videoName: team2ActiveBot?.videoName },
					],
				},
			],
		});

		await context.db.events.updateOne((e) => e.id === "may", {
			currentMatchId: matchId,
		});
	});

export const TeamsMatchList = ({ schedule, participants }: { schedule: Schedule; participants: Participant[] }) => {
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

		toast.success("Teams match updated successfully");
		router.invalidate();
	};

	return (
		<div className="flex flex-row gap-4">
			<Form {...form}>
				<DevTool control={form.control} placement="top-right" />
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					// className="p-6 gap-y-6 flex bg-zinc-900 rounded-xl shadow-lg"
				>
					<div className="p-6 gap-y-6 flex bg-zinc-900 rounded-xl shadow-lg">
						<div className="flex-1 flex flex-col gap-10">
							<TeamName fieldName="team1Name" form={form} />
							<TeamList team="team1" participants={participants} form={form} />
						</div>

						<Separator orientation="vertical" className="h-auto! my-10 mx-10 w-2" />
						<div className="flex-1 flex flex-col gap-10">
							<TeamName fieldName="team2Name" form={form} />
							<TeamList team="team2" participants={participants} form={form} />
						</div>
					</div>

					{form.formState.errors && <div className="text-red-500">{JSON.stringify(form.formState.errors)}</div>}

					<Button type="submit" className="mt-10 w-30">
						Save
					</Button>
				</form>
			</Form>
			{schedule.matches[0] && (
				<div>
					<ResultForm scheduleId={schedule.id} match={schedule.matches[0]} participants={participants} />
				</div>
			)}
		</div>
	);
};
