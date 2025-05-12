import { Button } from "@/components/ui/button";
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
import {
	MatchSchema,
	type Participant,
	type Schedule,
	ScheduleSchema,
} from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

type Props = {
	participants: Participant[];
	onSubmit: (data: Schedule["matches"][number]) => void;
	defaultValues: Schedule["matches"][number];
};

export const QualifyingMatchForm = ({
	participants,
	onSubmit,
	defaultValues,
}: Props) => {
	const form = useForm<Schedule["matches"][number]>({
		defaultValues,
		resolver: zodResolver(MatchSchema),
	});

	const selectedParticipants = form.watch("participants");

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-6 gap-y-6 flex flex-col items-start  w-6/12 bg-zinc-900 rounded-xl shadow-lg"
			>
				<h2 className="text-lg font-bold text-white mb-2">EDIT MATCH</h2>

				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Match name" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="participants.0"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Bot 1</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-zinc-800 text-white font-bold">
										<SelectValue placeholder="Select bot 1" />
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 text-white">
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
					name="participants.1"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel className="text-white">Bot 2</FormLabel>
							<FormControl>
								<Select value={field.value} onValueChange={field.onChange}>
									<SelectTrigger className="bg-zinc-800 text-white font-bold">
										<SelectValue placeholder="Select bot 2" />
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 text-white">
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

				<div className="flex gap-4 w-full">
					<FormField
						name="winner.id"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex-1">
								<FormLabel className="text-white">Winner</FormLabel>
								<FormControl>
									<Select value={field.value} onValueChange={field.onChange}>
										<SelectTrigger className="bg-zinc-800 text-white font-bold">
											<SelectValue placeholder="Select winner" />
										</SelectTrigger>
										<SelectContent className="bg-zinc-800 text-white">
											{selectedParticipants.map((id: string) => {
												const bot = participants.find((p) => p.id === id);
												return bot ? (
													<SelectItem
														key={bot.id}
														value={bot.id}
														className="font-bold"
													>
														{bot.name}
													</SelectItem>
												) : null;
											})}
										</SelectContent>
									</Select>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="winner.condition"
						control={form.control}
						render={({ field }) => (
							<FormItem className="flex flex-col items-start">
								<FormLabel className="text-white">By</FormLabel>
								<div className="flex gap-2 mt-1">
									{["KO", "JD", "NS"].map((cond) => (
										<Button
											key={cond}
											variant={field.value === cond ? "secondary" : "outline"}
											className="px-4 py-1 font-bold"
											onClick={() => field.onChange(cond)}
											type="button"
										>
											{cond}
										</Button>
									))}
								</div>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>

				<Button
					type="submit"
					variant="default"
					className="w-full mt-6 py-3 text-lg font-bold"
				>
					SAVE
				</Button>
			</form>
		</Form>
	);
};
