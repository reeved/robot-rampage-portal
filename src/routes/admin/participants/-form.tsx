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
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="p-4 gap-y-4 flex flex-col items-start"
			>
				<FormField
					name="name"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Name</FormLabel>
							<FormControl>
								<Input {...field} placeholder="Enter participant name" />
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
								<Input
									{...field}
									placeholder="Enter builder names, comma-separated"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<FormField
					name="weight"
					control={form.control}
					render={({ field }) => (
						<FormItem>
							<FormLabel>Weight</FormLabel>
							<FormControl>
								<Input
									{...field}
									type="number"
									placeholder="Bot weight (Kg)"
									onChange={(e) =>
										field.onChange(
											e.target.value
												? Number.parseFloat(e.target.value)
												: undefined,
										)
									}
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>

				<Button type="submit">Submit</Button>
			</form>
		</Form>
	);
};
