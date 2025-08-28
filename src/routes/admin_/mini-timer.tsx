import { queryOptions, useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { dbMiddleware } from "@/middleware";
import { TimeText, useTimer } from "../_view_/-timer";
import { TimerMiniPreview } from "../_view_/-timer-mini-preview";
import { Overlay } from "../_view_/overlay";

const getEventData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }) => {
		return context.db.events.findOne((e) => e.id === "may");
	});

const eventQuery = queryOptions({
	queryKey: ["event"],
	queryFn: getEventData,
	refetchInterval: 1000,
});

export const Route = createFileRoute("/admin_/mini-timer")({
	component: RouteComponent,
	loader: async ({ context }) => context.queryClient.ensureQueryData(eventQuery),
});

function RouteComponent() {
	const { currentTime } = useTimer("EVENT");

	const timeIsZero = currentTime.minutes === "00" && currentTime.seconds === "00";

	const { data } = useQuery(eventQuery);

	if (!data?.miniTimerText) {
		return null;
	}

	return (
		<Overlay>
			{!timeIsZero && (
				<div className="flex flex-col gap-4 items-center justify-center p-4 absolute top-10 font-rubik">
					<p className="font-rubik text-xl bg-black/40 px-4 py-2">{data.miniTimerText}</p>
					<div className="relative">
						<TimerMiniPreview>
							<TimeText currentTime={currentTime} />
						</TimerMiniPreview>
					</div>
				</div>
			)}
		</Overlay>
	);
}
