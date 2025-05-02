import { type Participant, ParticipantSchema } from "@/db";
import { dbMiddleware } from "@/middleware";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ParticipantForm } from "./-form";

const addParticipant = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(ParticipantSchema)
	.handler(async ({ data, context }) => {
		await context.db.participants.insert({
			id: Date.now().toString(),
			name: data.name,
			builders: data.builders,
			weight: data.weight,
			images: [],
		});
		return true;
	});

const defaultValues: Participant = {
	id: "",
	name: "",
	builders: "",
	images: [],
};

export const Route = createFileRoute("/admin/participants/new")({
	component: RouteComponent,
});

function RouteComponent() {
	return (
		<div key="new">
			<ParticipantForm
				defaultValues={defaultValues}
				onSubmit={(value) => addParticipant({ data: value })}
			/>
		</div>
	);
}
