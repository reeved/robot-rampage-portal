import type { Schedule } from "@/db";
import { generateId } from "@/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { getSchedule } from "./$id";
import { updateSchedule } from "./$id.$matchId";
import { QualifyingMatchForm } from "./-qualifying-match-form";

export const Route = createFileRoute("/admin/schedule/$id/new")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const { schedule, participants } = Route.useLoaderData();

	const handleUpdate = async (data: Schedule["matches"][number]) => {
		const updatedMatches = [...schedule.matches, { ...data, id: generateId("match") }];

		await updateSchedule({
			...schedule,
			matches: updatedMatches,
			// biome-ignore lint/suspicious/noExplicitAny: <explanation>
		} as any);

		router.invalidate();
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
