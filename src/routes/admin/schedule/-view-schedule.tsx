import { Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { DeleteConfirmation } from "@/components/ui/delete-confirmation";
import type { Participant, Schedule } from "@/db";
import { dbMiddleware } from "@/middleware";
import { MatchList } from "./-match-list";
import { TeamsMatchList } from "./-teams-match-list";

export const deleteSchedule = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(z.object({ id: z.string() }))
	.handler(async ({ data, context }) => {
		const schedule = await context.db.schedule.findOne((s) => s.id === data.id);

		if (!schedule) {
			throw new Error("Schedule not found");
		}

		await context.db.schedule.delete((s) => s.id === data.id);
		return data;
	});

export const ViewSchedule = ({
	schedule,
	participants,
	currentMatchId,
}: {
	schedule: Schedule;
	participants: Participant[];
	currentMatchId: string | undefined;
}) => {
	const router = useRouter();

	const handleDelete = async () => {
		await deleteSchedule({ data: { id: schedule.id } });
		toast.success("Schedule deleted!");
		router.invalidate();
		router.navigate({ to: ".." });
	};

	return (
		<div className="flex gap-6 2xl:col-span-5">
			<div className="flex flex-col gap-2 flex-1">
				<div className="flex items-center justify-between mb-4 gap-4">
					<h1 className="flex-1 text-xl font-bold">{schedule.name}</h1>

					{schedule.type !== "TEAMS" && (
						<Link
							to={schedule.type !== "BRACKET" ? "/admin/schedule/$id/new" : "/admin/schedule/$id/newbracket"}
							params={{ id: schedule.id }}
						>
							<Button type="button" variant="default">
								<PlusIcon className="w-4 h-4" />
								Add new match
							</Button>
						</Link>
					)}
					<DeleteConfirmation
						onDelete={handleDelete}
						buttonText="Delete Schedule"
						title="Delete Schedule"
						description="Are you sure you want to delete this schedule? This action cannot be undone."
					/>
				</div>

				{schedule.type === "TEAMS" ? (
					<TeamsMatchList schedule={schedule} participants={participants} />
				) : (
					<MatchList schedule={schedule} participants={participants} currentMatchId={currentMatchId} />
				)}
			</div>
		</div>
	);
};
