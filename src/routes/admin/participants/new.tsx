import { type Participant, ParticipantSchema } from "@/db";
import { generateId } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { ParticipantForm } from "./-form";

const addParticipant = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(ParticipantSchema)
	.handler(async ({ data, context }) => {
		await context.db.participants.insert({
			id: generateId(),
			type: data.type,
			name: data.name,
			builders: data.builders,
			weight: data.weight,
			videos: data.videos,
			weapon: data.weapon,
			isCompeting: true,
			isDead: false,
		});
		return true;
	});

const defaultValues: Participant = {
	id: "",
	type: "FEATHERWEIGHT",
	name: "",
	builders: "",
	videos: "",
	weapon: "",
	isCompeting: true,
	isDead: false,
};

export const Route = createFileRoute("/admin/participants/new")({
	component: RouteComponent,
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const router = useRouter();

	const handleSave = (data: Participant) => {
		addParticipant({ data });
		router.invalidate();
		return navigate({ to: "/admin/participants" });
	};

	return (
		<div key="new">
			<ParticipantForm defaultValues={defaultValues} onSubmit={handleSave} />
		</div>
	);
}
