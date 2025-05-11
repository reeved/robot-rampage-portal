import { Schedule } from "@/db";
import { generateId } from "@/lib/utils";
import { createFileRoute } from "@tanstack/react-router";
import { getSchedule } from "./$id";
import { updateSchedule } from "./$id.$matchId";
import { QualifyingMatchForm } from "./-qualifying-match-form";

export const Route = createFileRoute("/admin/schedule/$id/new")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const navigate = Route.useNavigate();
	const { schedule, participants } = Route.useLoaderData();

	const handleUpdate = async (data: Schedule["matches"][number]) => {
		const updatedMatches = [
			...schedule.matches,
			{ ...data, id: generateId("match") },
		];

		await updateSchedule({ data: { ...schedule, matches: updatedMatches } });
		return navigate({ to: "/admin/schedule/$id", params: { id: schedule.id } });
	};

	return (
		<div>
			<QualifyingMatchForm
				participants={participants}
				onSubmit={handleUpdate}
				defaultValues={{
					name: `Match ${schedule.matches.length + 1}`,
					participants: [],
					id: "",
				}}
			/>
		</div>
	);
}
