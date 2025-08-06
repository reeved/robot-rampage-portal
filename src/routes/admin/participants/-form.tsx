import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { type Participant, ParticipantSchema } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

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
			<form onSubmit={form.handleSubmit(onSubmit)} className="p-4 gap-y-4 flex flex-col items-start">
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} className="w-[90ch]" placeholder="Enter participant name" />
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

				<FormField
					name="builders"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Builders</FormLabel>
							<FormControl>
								<Input {...field} className="w-[90ch]" placeholder="Enter builder names, comma-separated" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="videos"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Videos</FormLabel>
							<FormControl>
								<Input {...field} className="w-[90ch]" placeholder="Comma-separated video paths" />
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
								<Input {...field} className="w-[90ch]" placeholder="Name of photo for app" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

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
								<Input {...field} className="w-[90ch]" placeholder="Weapon description" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="funFact"
					control={form.control}
					rules={{ required: false }}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Fun fact</FormLabel>
							<FormControl>
								<Input {...field} className="w-[90ch]" placeholder="Something fun about the bot" />
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
								<Input {...field} className="w-[90ch]" placeholder="1st place" />
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<div className="flex flex-col gap-4 my-4">
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

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};
