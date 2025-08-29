import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { type BracketMatch, BracketMatchSchema, type Participant, type Schedule } from "@/db";
import { deleteMatch } from "./-qualifying-match-form";
import { getBotVideos } from "./-queue-match-form";

type Props = {
	bracketNames: string[];
	participants: Participant[];
	onSubmit: (data: BracketMatch) => void;
	defaultValues: Schedule["matches"][number];
};

export const BracketMatchForm = ({ bracketNames, participants, onSubmit, defaultValues }: Props) => {
	const router = useRouter();
	const form = useForm<BracketMatch>({
		defaultValues,
		resolver: zodResolver(BracketMatchSchema),
	});

	const selectedParticipants = form.watch("participants");
	const { bot1Videos, bot2Videos } = getBotVideos(participants, selectedParticipants);

	const handleDelete = async () => {
		await deleteMatch({ data: { id: defaultValues.id } });
		toast.success("Match deleted!");
		router.invalidate();
		router.navigate({ to: ".." });
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-4 flex flex-col items-start  bg-zinc-900 rounded-md shadow-lg"
			>
				<div className="flex justify-between w-full">
					<h2 className="text-lg font-bold text-white mb-2">EDIT MATCH</h2>
					{defaultValues.id && (
						<DeleteConfirmation
							variant="button"
							onDelete={handleDelete}
							buttonText="Delete Match"
							title="Delete Match"
							description="Are you sure you want to delete this match? This action cannot be undone."
						/>
					)}
				</div>

				<div className="flex gap-4">
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
							name="bracket"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">Bracket</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select bracket" />
											</SelectTrigger>
											<SelectContent className="bg-zinc-800 text-white">
												{bracketNames.map((name) => (
													<SelectItem key={name} value={name} className="font-bold">
														{name}
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
							name="round"
							control={form.control}
							render={({ field }) => (
								<FormItem>
									<FormLabel className="text-white">Round</FormLabel>
									<FormControl>
										<Select value={field.value} onValueChange={field.onChange}>
											<SelectTrigger className="bg-zinc-800 text-white font-bold">
												<SelectValue placeholder="Select round" />
											</SelectTrigger>
											<SelectContent className="bg-zinc-800 text-white">
												{["QF1", "QF2", "QF3", "QF4", "SF1", "SF2", "Final"].map((name) => (
													<SelectItem key={name} value={name} className="font-bold">
														{name}
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
				</div>
				<Separator orientation="horizontal" className="my-4" />

				<div className="flex gap-10 lg:flex-row flex-col w-full">
					<div className="flex flex-1 flex-col gap-4">
						<div className="flex gap-4">
							<FormField
								name="participants.0.id"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">
											Bot 1 <span className="text-rrorange font-medium">(ORANGE)</span>
										</FormLabel>{" "}
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
									<FormLabel>Bot 1 Intro Text</FormLabel>
									<FormControl>
										<Textarea {...field} placeholder="Intro text" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
					<div className="flex flex-1 flex-col gap-4">
						<div className="flex gap-4">
							<FormField
								name="participants.1.id"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">
											Bot 2 <span className="text-rrblue font-medium">(BLUE)</span>
										</FormLabel>{" "}
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
									<FormLabel>Bot 2 Intro Text</FormLabel>
									<FormControl>
										<Textarea {...field} placeholder="Intro text" />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
					</div>
				</div>

				<Button type="submit" variant="default" className="w-full mt-6 py-3 text-lg font-bold">
					SAVE
				</Button>
			</form>
		</Form>
	);
};
