import { type Participant, ParticipantSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, redirect, useRouter } from "@tanstack/react-router";
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
			type: data.data.type,
			builders: data.data.builders,
			weight: data.data.weight,
			weapon: data.data.weapon,
			videos: data.data.videos.trim() ?? "",
			photo: data.data.photo,
			funFact: data.data.funFact,
			previousRank: data.data.previousRank,
		});
		return true;
	});

const getParticipant = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.validator(z.string())
	.handler(async ({ data: id, context }) => {
		const participant = await context.db.participants.findOne(
			(p) => p.id === id,
		);

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
	const router = useRouter();
	const data = Route.useLoaderData();
	const navigate = Route.useNavigate();

	const handleSave = (formData: Participant) => {
		updateParticipant({ data: { data: formData, id: data.id } });
		router.invalidate();
		return navigate({ to: "/admin/participants" });
	};

	return (
		<div key={data.id}>
			<ParticipantForm defaultValues={data} onSubmit={handleSave} />
		</div>
	);
}
