import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type Participant, type Schedule, TeamsMatchSchema } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, useForm } from "react-hook-form";
import type { z } from "zod";

const teamsSchema = TeamsMatchSchema.pick({
	team1bots: true,
	team2bots: true,
	team1Name: true,
	team2Name: true,
});

type TeamsSchema = z.infer<typeof teamsSchema>;

export const TeamsMatchList = ({
	schedule,
	participants,
}: { schedule: Schedule; participants: Participant[] }) => {
	if (schedule.type !== "TEAMS") {
		return null;
	}

	const form = useForm<TeamsSchema>({
		defaultValues: {
			team1Name: schedule.team1Name,
			team2Name: schedule.team2Name,
			team1bots: schedule.team1bots,
			team2bots: schedule.team2bots,
		},
		resolver: zodResolver(teamsSchema),
	});

	const onSubmit = (data: TeamsSchema) => {
		console.log(data);
	};

	return (
		<div>
			TeamsMatchList
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="p-6 gap-y-6 flex flex-col items-start bg-zinc-900 rounded-xl shadow-lg"
				>
					<div className="flex gap-4">
						{(["bot1", "bot2", "bot3", "bot4", "bot5"] as const).map((bot) => (
							<FormField
								key={`team1-${bot}`}
								name={`team1bots.${bot}`}
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">
											Bot {bot.charAt(-1)}
										</FormLabel>
										<FormControl>
											<Select
												value={field.value?.id ?? undefined}
												onValueChange={field.onChange}
											>
												<SelectTrigger className="bg-zinc-800 text-white font-bold">
													<SelectValue
														placeholder={`Select bot${bot.charAt(-1)}`}
													/>
												</SelectTrigger>
												<SelectContent className="bg-zinc-800 text-white">
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
						))}
					</div>
				</form>
			</Form>
		</div>
	);
};
