import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { type Participant, ParticipantSchema } from "@/db";

export const ParticipantForm = ({
	onSubmit,
	defaultValues,
}: {
	onSubmit: (data: Participant) => void;
	defaultValues: Participant;
}) => {
	const form = useForm<Participant>({
		defaultValues,
		resolver: zodResolver(ParticipantSchema),
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="px-4 gap-10 flex items-start">
				<div className="flex flex-col gap-4">
					<h3 className="text-2xl font-bold">General</h3>
					<div className="flex gap-4 items-center">
						<div className="flex flex-col gap-4">
							<FormField
								name="name"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel>Name</FormLabel>
										<FormControl>
											<Input {...field} className="w-[60ch]" placeholder="Enter participant name" />
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<FormField
								name="type"
								control={form.control}
								render={({ field }) => (
									<FormItem>
										<FormLabel className="text-white">Weight class</FormLabel>
										<FormControl>
											<Select value={field.value} onValueChange={field.onChange}>
												<SelectTrigger className="bg-zinc-800 text-white font-bold">
													<SelectValue placeholder="Select weight class" />
												</SelectTrigger>
												<SelectContent className="bg-zinc-800 text-white">
													{["FEATHERWEIGHT", "HEAVYWEIGHT"].map((type) => (
														<SelectItem key={type} value={type} className="font-bold">
															{type}
														</SelectItem>
													))}
												</SelectContent>
											</Select>
										</FormControl>
										<FormMessage />
									</FormItem>
								)}
							/>

							<div className="flex gap-12 my-4">
								<FormField
									name="isCompeting"
									control={form.control}
									rules={{ required: false }}
									render={({ field }) => (
										<FormItem className="flex flex-row gap-2 items-center">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={(checked) => {
														field.onChange(checked);
													}}
												/>
											</FormControl>
											<FormLabel className="text-sm font-normal">Competing at event</FormLabel>
											<FormMessage />
										</FormItem>
									)}
								/>
								<FormField
									name="isDead"
									control={form.control}
									rules={{ required: false }}
									render={({ field }) => (
										<FormItem className="flex flex-row gap-2 items-center">
											<FormControl>
												<Checkbox
													checked={field.value}
													onCheckedChange={(checked) => {
														field.onChange(checked);
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
						{defaultValues.photo && <img alt="bot-image" src={`/${defaultValues.photo}`} className="h-30 flex-1" />}
					</div>

					<h3 className="my-4 text-2xl font-bold">Team Info</h3>

					<FormField
						name="builders"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Builders</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Enter builder names, comma-separated" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="town"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Town</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Enter builder town" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="occupation"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Occupation</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Enter builder occupation" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="teamExperience"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Team experience</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Enter team experience" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<h3 className="my-4 text-2xl font-bold">Stats</h3>

					<FormField
						name="weight"
						control={form.control}
						rules={{ required: false }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Weight</FormLabel>
								<FormControl>
									<Input
										{...field}
										type="number"
										placeholder="Bot weight (Kg)"
										className="w-[20ch]"
										onChange={(e) => field.onChange(e.target.value ? Number.parseFloat(e.target.value) : undefined)}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="weapon"
						control={form.control}
						rules={{ required: false }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Weapon</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Weapon description" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="previousRank"
						control={form.control}
						rules={{ required: false }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Rank at last event e.g. (1st Place)</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="1st place" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<Button type="submit" className="w-full mt-10">
						Submit
					</Button>
				</div>
				<div className="flex flex-col gap-4">
					<h3 className="text-2xl font-bold">Media</h3>

					<FormField
						name="videos"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Videos</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Comma-separated video paths" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<FormField
						name="photo"
						control={form.control}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Photo</FormLabel>
								<FormControl>
									<Input {...field} className="w-[60ch]" placeholder="Name of photo for app" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<h3 className="my-4 text-2xl font-bold">Other Info</h3>

					<FormField
						name="otherNotes"
						control={form.control}
						rules={{ required: false }}
						render={({ field }) => (
							<FormItem>
								<FormLabel>Other notes</FormLabel>
								<FormControl>
									<Textarea
										{...field}
										className="w-[60ch]"
										rows={6}
										placeholder="Other notes about the team or robot"
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</form>
		</Form>
	);
};
