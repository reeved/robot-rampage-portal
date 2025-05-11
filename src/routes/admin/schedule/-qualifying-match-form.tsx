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
							<FormLabel>Match name</FormLabel>
							<FormControl>
								<Input
									{...field}
									className="w-[90ch]"
									placeholder="Enter match name"
								/>
							</FormControl>
							<FormMessage />
						</FormItem>
					)}
				/>
			</form>
		</Form>
	);
};
