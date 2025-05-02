import { ParticipantSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, redirect } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { ParticipantForm } from "./-form";

const updateParticipant = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(z.object({ data: ParticipantSchema, id: z.string() }))
	.handler(async ({ data, context }) => {
		await context.db.participants.updateOne((p) => p.id === data.id, {
			name: data.data.name,
			builders: data.data.builders,
			weight: data.data.weight,
			images: data.data.images ?? [],
		});
		return true;
	});

const getParticipant = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const participant = await context.db.participants.findOne((p) => p.id === id);

		if (!participant) {
			throw redirect({ to: "/admin/participants" });
		}
		return participant;
	});

export const Route = createFileRoute("/admin/participants/$id")({
	component: RouteComponent,
	loader: async ({ params }) => getParticipant({ data: params.id }),
});

function RouteComponent() {
	const data = Route.useLoaderData();

	return (
		<div key={data.id}>
			<ParticipantForm
				defaultValues={data}
				onSubmit={(value) =>
					updateParticipant({ data: { data: value, id: data.id } })
				}
			/>
		</div>
	);
}
