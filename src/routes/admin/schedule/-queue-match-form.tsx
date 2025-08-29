import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Match, Participant, Schedule } from "@/db";
import { Vmix } from "@/lib/vmix-api";
import { dbMiddleware } from "@/middleware";

const QueueSchema = z.object({
	scheduleId: z.string(),
	matchId: z.string(),
	bot1Video: z.string().optional(),
	bot2Video: z.string().optional(),
});

type QueueMatchSchema = z.infer<typeof QueueSchema>;

const queueSelectedMatch = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(QueueSchema)
	.handler(async ({ data, context }) => {
		await Vmix.UpdateListsForMatch(data.bot1Video, data.bot2Video);

		await context.db.events.updateOne((e) => e.id === "may", {
			currentMatchId: data.matchId,
		});

		return true;
	});

export const getBotVideos = (participants: Participant[], matchParticipants: Match["participants"]) => {
	const bot1 = participants.find((p) => p.id === matchParticipants[0]?.id);
	const bot2 = participants.find((p) => p.id === matchParticipants[1]?.id);

	const bot1Videos = bot1?.videos.split(",").filter(Boolean) ?? [];
	const bot2Videos = bot2?.videos.split(",").filter(Boolean) ?? [];

	return { bot1Videos, bot2Videos, bot1, bot2 };
};

type Props = {
	match: Schedule["matches"][number];
	participants: Participant[];
};

export const QueueMatchForm = ({ match, participants }: Props) => {
	const router = useRouter();
	const { bot1Videos, bot2Videos, bot1, bot2 } = getBotVideos(participants, match.participants);

	const form = useForm<QueueMatchSchema>({
		defaultValues: {
			bot1Video: match.participants[0].videoName ?? bot1Videos[0],
			bot2Video: match.participants[1].videoName ?? bot2Videos[0],
		},
		resolver: zodResolver(QueueSchema),
	});

	const onSubmit = async () => {
		await queueSelectedMatch({
			data: {
				scheduleId: match.id,
				matchId: match.id,
				bot1Video: form.getValues("bot1Video"),
				bot2Video: form.getValues("bot2Video"),
			},
		});

		router.invalidate();
		toast.success("Match queued");
	};

	return (
		<Form {...form}>
			<form className="p-6 gap-y-6 flex flex-col items-start w-full md:w-6/12 bg-zinc-900 rounded-md shadow-lg">
				<h2 className="text-lg font-bold text-white mb-2">QUEUE MATCH</h2>

				<FormField
					name="bot1Video"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">{bot1?.name} video</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-zinc-800 text-white font-bold">
										<SelectValue placeholder="Select bot 1 video" />
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
					)}
				/>
				<FormField
					name="bot2Video"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">{bot2?.name} video</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-zinc-800 text-white font-bold">
										<SelectValue placeholder="Select bot 2 video" />
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 text-white">
										{bot2Videos.map((v) => (
											<SelectItem key={v} value={v} className="font-bold">
												{v}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="button" onClick={onSubmit} variant="default" className="w-full mt-4 py-3 text-lg font-bold">
					QUEUE MATCH
				</Button>
			</form>
		</Form>
	);
};
