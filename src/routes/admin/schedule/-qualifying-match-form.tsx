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
import { MatchSchema, type Participant, type Schedule } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { getBotVideos } from "./-queue-match-form";

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
	const { bot1Videos, bot2Videos } = getBotVideos(
		participants,
		selectedParticipants,
	);

	return (
		<>
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="p-6 gap-y-6 flex flex-col items-start  bg-zinc-900 rounded-xl shadow-lg"
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

					<div className="flex gap-4">
						<FormField
							name="participants.0.id"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">
										Bot 1{" "}
										<span className="text-rrorange font-medium">(ORANGE)</span>
									</FormLabel>{" "}
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select bot 1" />
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

						<FormField
							name="participants.0.videoName"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">Bot 1 Video</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select bot 1 video" />
											</SelectTrigger>
											<SelectContent className="bg-zinc-800 text-white">
												{bot1Videos.map((video) => (
													<SelectItem
														key={video}
														value={video}
														className="font-bold"
													>
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

					<div className="flex gap-4">
						<FormField
							name="participants.1.id"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">
										Bot 2{" "}
										<span className="text-rrblue font-medium">(BLUE)</span>
									</FormLabel>{" "}
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select bot 2" />
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

						<FormField
							name="participants.1.videoName"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">Bot 2 Video</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select bot 2 video" />
											</SelectTrigger>
											<SelectContent className="bg-zinc-800 text-white">
												{bot2Videos.map((video) => (
													<SelectItem
														key={video}
														value={video}
														className="font-bold"
													>
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

					<Button
						type="submit"
						variant="default"
						className="w-full mt-6 py-3 text-lg font-bold"
					>
						SAVE
					</Button>
				</form>
			</Form>
		</>
	);
};
