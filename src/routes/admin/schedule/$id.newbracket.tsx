import { createFileRoute, useRouter } from "@tanstack/react-router";
import type { Schedule } from "@/db";
import { generateId } from "@/lib/utils";
import { BracketMatchForm } from "./-bracket-match-form";
import { getSchedule } from "./$id";
import { updateSchedule } from "./$id.$matchId";

export const Route = createFileRoute("/admin/schedule/$id/newbracket")({
	component: RouteComponent,
	loader: async ({ params }) => getSchedule({ data: params.id }),
});

function RouteComponent() {
	const router = useRouter();
	const navigate = Route.useNavigate();
	const { schedule, participants, bracketNames } = Route.useLoaderData();

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
		<div className="flex flex-col gap-y-6 2xl:col-span-7">
			<BracketMatchForm
				bracketNames={bracketNames}
				participants={participants}
				onSubmit={handleUpdate}
				defaultValues={{
					name: `Match ${schedule.matches.length + 1}`,
					participants: [],
					id: "",
					bracket: "",
					round: "SF1",
				}}
			/>
		</div>
	);
}
