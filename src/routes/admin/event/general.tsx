import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { dbMiddleware } from "@/middleware";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { EventSchema } from "@/db";
import { MiniTimerSection } from "./-mini-timer-section";
import { BracketsSection } from "./-brackets-section";

const updateEventGeneral = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(
		z.object({
			eventId: z.string(),
			miniTimerText: z.string(),
			brackets: z.array(z.object({ name: z.string(), size: z.union([z.literal(4), z.literal(8)]) })),
		}),
	)
	.handler(async ({ data, context }) => {
		await context.db.events.updateOne((e) => e.id === data.eventId, {
			miniTimerText: data.miniTimerText,
			brackets: data.brackets,
		});
		return true;
	});

const getEventData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		const event = await context.db.events.findOne((e) => e.id === "may");
		if (!event) {
			throw new Error("Event 'may' not found");
		}
		return event;
	});

const eventQuery = queryOptions({
	queryKey: ["admin-event-general", "may"],
	queryFn: async () => getEventData(),
});

export const Route = createFileRoute("/admin/event/general")({
	component: RouteComponent,
	loader: async ({ context }) => {
		return context.queryClient.ensureQueryData(eventQuery);
	},
});

const formSchema = EventSchema.pick({ miniTimerText: true, brackets: true });

type FormData = z.infer<typeof formSchema>;

function RouteComponent() {
	const router = useRouter();
	const { data: event } = useQuery(eventQuery);

	const form = useForm<FormData>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			miniTimerText: event?.miniTimerText ?? "",
			brackets: event?.brackets ?? [],
		},
	});

	useEffect(() => {
		if (event) {
			form.reset({
				miniTimerText: event.miniTimerText,
				brackets: event.brackets,
			});
		}
	}, [event, form]);

	const onSubmit = async (data: FormData) => {
		if (!event) return;

		await updateEventGeneral({ data: { eventId: event.id, ...data } });
		toast.success("Event settings updated!");
		router.invalidate();
	};

	if (!event) {
		return (
			<div className="p-6 flex flex-col gap-6 bg-zinc-900 rounded-xl shadow-lg">
				<div className="text-center py-8 text-zinc-500">
					<p>Loading event data...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="p-6 flex flex-col gap-6 bg-zinc-900 rounded-xl shadow-lg">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold">GENERAL EVENT SETTINGS</h2>
			</div>

			<Form {...form} key={event.id}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
					<MiniTimerSection control={form.control} />
					<BracketsSection control={form.control} />

					<Button type="submit" variant="default" className="font-bold">
						Save Changes
					</Button>
				</form>
			</Form>
		</div>
	);
}
