import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { MatchSchema, type Participant, type Schedule, TeamMatchSchema } from "@/db";
import { Vmix } from "@/lib/vmix-api";
import { dbMiddleware } from "@/middleware";
import { getBotVideos } from "./-queue-match-form";

const updateMatch = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(TeamMatchSchema)
	.handler(async ({ data, context }) => {
		const schedule = await context.db.schedule.findOne((s) => s.matches.some((m) => m.id === data.id));

		if (!schedule) {
			throw new Error("Schedule not found");
		}

		schedule.matches = schedule.matches.map((m) => (m.id === data.id ? data : m));
		await context.db.schedule.updateOne((s) => s.id === schedule.id, schedule);
		await Vmix.UpdateListsForMatch(data.participants[0].videoName, data.participants[1].videoName);

		return data;
	});

type Props = {
	participants: Participant[];
	defaultValues: Schedule["matches"][number];
};

export const TeamsMatchForm = ({ participants, defaultValues }: Props) => {
	const router = useRouter();
	const form = useForm<Schedule["matches"][number]>({
		defaultValues,
		resolver: zodResolver(MatchSchema),
	});

	const selectedParticipants = form.watch("participants");
	const { bot1Videos, bot2Videos, bot1, bot2 } = getBotVideos(participants, selectedParticipants);

	const onSubmit = async (data: Schedule["matches"][number]) => {
		await updateMatch({ data });
		toast.success("Match updated!");
		router.invalidate();
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-6 gap-y-6 flex flex-col items-start  bg-zinc-900 rounded-xl shadow-lg"
			>
				<div className="flex justify-between w-full">
					<h2 className="text-lg font-bold text-white mb-2">EDIT MATCH</h2>
				</div>

				<div className="flex gap-4">
					<FormField
						name="participants.0.videoName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">{bot1?.name ?? "Bot 1"} Video</FormLabel>
								<FormControl>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="bg-zinc-800 text-white font-bold">
											<SelectValue placeholder={`Select ${bot1?.name ?? "Bot 1"} video`} />
										</SelectTrigger>
										<SelectContent className="bg-zinc-800 text-white">
											{bot1Videos.map((video) => (
												<SelectItem key={video} value={video} className="font-bold">
													{video}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					name="participants.0.introText"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{bot1?.name ?? "Bot 1"} Intro Text</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder="Intro text" rows={3} className="w-[60ch]" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex gap-4">
					<FormField
						name="participants.1.videoName"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel className="text-white">{bot2?.name ?? "Bot 2"} Video</FormLabel>
								<FormControl>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="bg-zinc-800 text-white font-bold">
											<SelectValue placeholder={`Select ${bot2?.name ?? "Bot 2"} video`} />
										</SelectTrigger>
										<SelectContent className="bg-zinc-800 text-white">
											{bot2Videos.map((video) => (
												<SelectItem key={video} value={video} className="font-bold">
													{video}
												</SelectItem>
											))}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<FormField
					name="participants.1.introText"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>{bot2?.name ?? "Bot 2"} Intro Text</FormLabel>
							<FormControl>
								<Textarea {...field} placeholder="Intro text" rows={3} className="w-[60ch]" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit" variant="default" className="w-full mt-6 py-3 text-lg font-bold">
					SAVE
				</Button>
			</form>
		</Form>
	);
};
