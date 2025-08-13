import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Participant } from "@/db";
import { dbMiddleware } from "@/middleware";
import { useRouter, createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { queryOptions, useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

type FinalRankingsData = {
	participants: Participant[];
	event: {
		id: string;
		finalRankings?: { id: string; position: number }[];
	};
};

const getFinalRankingsData = createServerFn({
	method: "GET",
})
	.middleware([dbMiddleware])
	.handler(async ({ context }): Promise<FinalRankingsData> => {
		const events = await context.db.events.find(() => true);
		const currentEvent = events[0];
		if (!currentEvent) {
			throw new Error("No event found");
		}

		const participants = (await context.db.participants.find(() => true)).filter(
			(p) => p.isCompeting && p.type === "FEATHERWEIGHT",
		);

		return {
			participants,
			event: {
				id: currentEvent.id,
				finalRankings: currentEvent.finalRankings,
			},
		};
	});

const saveFinalRankings = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(
		z.object({
			eventId: z.string(),
			finalRankings: z.array(
				z.object({
					id: z.string(),
					position: z.number(),
				}),
			),
		}),
	)
	.handler(async ({ data, context }) => {
		const { eventId, finalRankings } = data;

		await context.db.events.updateOne((e) => e.id === eventId, {
			finalRankings,
		});

		return true;
	});

const dataQuery = queryOptions({
	queryKey: ["admin-final-rankings"],
	queryFn: async () => getFinalRankingsData(),
});

export const Route = createFileRoute("/admin/event/final-rankings")({
	component: RouteComponent,
	loader: async ({ context }) => context.queryClient.ensureQueryData(dataQuery),
});

function ordinal(n: number) {
	const s = ["th", "st", "nd", "rd"];
	const v = n % 100;
	return n + (s[(v - 20) % 10] || s[v] || s[0]);
}

function RouteComponent() {
	const router = useRouter();
	const { data } = useQuery(dataQuery);

	const participants = data?.participants ?? [];
	const eventId = data?.event.id ?? "";
	const existing = data?.event.finalRankings ?? [];

	const rowCount = participants.length;

	const [positions, setPositions] = useState<(string | undefined)[]>([]);

	// Initialize positions only once when data first loads
	useEffect(() => {
		if (existing.length > 0 && rowCount > 0) {
			const initialPositions: (string | undefined)[] = Array.from({ length: rowCount }, () => undefined);
			existing.forEach(({ id, position }) => {
				if (position >= 1 && position <= rowCount) initialPositions[position - 1] = id;
			});
			setPositions(initialPositions);
		} else if (rowCount > 0) {
			// If no existing rankings, initialize with empty positions
			setPositions(Array.from({ length: rowCount }, () => undefined));
		}
	}, [existing.length, rowCount]); // Only depend on length, not the actual arrays

	const selectedIds = useMemo(() => new Set(positions.filter(Boolean) as string[]), [positions]);

	const setPosition = useCallback((index: number, id: string | undefined) => {
		setPositions((prev) => {
			const next = [...prev];
			next[index] = id;
			return next;
		});
	}, []);

	const hasDuplicates = positions.filter(Boolean).length !== selectedIds.size;
	const canSave = !hasDuplicates && rowCount > 0 && !!eventId;

	const handleSave = async () => {
		if (!canSave) return;

		// Create final rankings with correct positions, skipping undefined slots
		const finalRankings: { id: string; position: number }[] = [];
		positions.forEach((id, index) => {
			if (id) {
				finalRankings.push({ id, position: index + 1 });
			}
		});

		await saveFinalRankings({ data: { eventId, finalRankings } });
		toast.success("Final rankings saved");
		router.invalidate();
	};

	return (
		<div className="p-6 flex flex-col gap-6 bg-zinc-900 rounded-xl shadow-lg">
			<div className="flex items-center justify-between">
				<h2 className="text-xl font-bold">FINAL RANKINGS</h2>
				<Button onClick={handleSave} disabled={!canSave} className="font-bold">
					Save
				</Button>
			</div>

			{hasDuplicates && (
				<div className="text-red-400 font-semibold">
					Duplicate selections detected. Ensure each bot is selected only once.
				</div>
			)}

			<div className="grid grid-cols-1 gap-3">
				{Array.from({ length: rowCount }, (_, i) => {
					const current = positions[i];
					const options = participants.filter((p) => !selectedIds.has(p.id) || p.id === current);
					return (
						<div key={i} className="flex items-center gap-4">
							<div className="w-36 font-bold">{ordinal(i + 1)}</div>
							<div className="flex-1">
								<Select value={current} onValueChange={(val) => setPosition(i, val)}>
									<SelectTrigger className="bg-zinc-800 text-white font-bold">
										<SelectValue placeholder="Select bot" />
									</SelectTrigger>
									<SelectContent className="bg-zinc-800 text-white max-h-80">
										{options.map((p) => (
											<SelectItem key={p.id} value={p.id} className="font-bold">
												{p.name}
											</SelectItem>
										))}
									</SelectContent>
								</Select>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
