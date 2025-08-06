import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { Match, Participant, Schedule } from "@/db";
import { cn } from "@/lib/utils";
import { dbMiddleware } from "@/middleware";
import {
	DndContext,
	type DragEndEvent,
	DragOverlay,
	type DragStartEvent,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Link, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { GripVertical } from "lucide-react";
import { useEffect, useState } from "react";
import { z } from "zod";

// Server function to update match order
export const updateMatchOrderFn = createServerFn({
	method: "POST",
})
	.middleware([dbMiddleware])
	.validator(
		z.object({
			scheduleId: z.string(),
			matchIds: z.array(z.string()),
		}),
	)
	.handler(async ({ data, context }) => {
		const schedule = await context.db.schedule.findOne((s) => s.id === data.scheduleId);
		if (!schedule) {
			throw new Error("Schedule not found");
		}

		// Reorder matches based on the new order
		const reorderedMatches = data.matchIds.map((matchId, index) => {
			const match = schedule.matches.find((m) => m.id === matchId);
			if (!match) {
				throw new Error(`Match ${matchId} not found`);
			}
			return {
				...match,
				name: schedule.type === "QUALIFYING" ? `Match ${index + 1}` : match.name,
			};
		});

		// Update the schedule with the new match order
		await context.db.schedule.updateOne((s) => s.id === data.scheduleId, {
			matches: reorderedMatches,
		});

		return { success: true };
	});

const SortableListItem = ({
	schedule,
	match,
	bot1,
	bot2,
	currentMatchId,
}: {
	schedule: Schedule;
	match: Match;
	bot1: Participant | undefined;
	bot2: Participant | undefined;
	currentMatchId: string | undefined;
}) => {
	const hasWinner = match.winner !== undefined;
	const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
		id: match.id,
		disabled: hasWinner,
	});

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn("relative group", isDragging && "opacity-50", hasWinner && "opacity-60")}
		>
			<Link to="/admin/schedule/$id/$matchId" params={{ id: schedule.id, matchId: match.id }}>
				<Card className={cn("p-2")}>
					<CardContent className="flex gap-4 items-center">
						<p className={cn("text-lg font-bold", match.id === currentMatchId && "text-green-500")}>{match.name}</p>
						<div className="flex items-center gap-4">
							<Badge
								variant="secondary"
								className={cn("text-lg", bot1 && match.winner?.id === bot1.id && "text-amber-400")}
							>
								{bot1?.name || "TBD"}
							</Badge>
							<p>vs</p>
							<Badge
								variant="secondary"
								className={cn("text-lg", bot2 && match.winner?.id === bot2.id && "text-amber-400")}
							>
								{bot2?.name || "TBD"}
							</Badge>
						</div>
						{/* Drag handle */}
						{!hasWinner && (
							<div
								{...attributes}
								{...listeners}
								className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing p-1 rounded"
							>
								<GripVertical className="h-4 w-4 text-gray-400" />
							</div>
						)}
					</CardContent>
				</Card>
			</Link>
		</div>
	);
};

const DraggingListItem = ({
	match,
	bot1,
	bot2,
	currentMatchId,
}: {
	match: Match;
	bot1: Participant | undefined;
	bot2: Participant | undefined;
	currentMatchId: string | undefined;
}) => {
	return (
		<Card className="p-2 shadow-lg">
			<CardContent className="flex gap-4 items-center">
				<p className={cn("text-lg font-bold", match.id === currentMatchId && "text-green-500")}>{match.name}</p>
				<div className="flex items-center gap-4">
					<Badge
						variant="secondary"
						className={cn("text-lg", bot1 && match.winner?.id === bot1.id && "text-amber-400")}
					>
						{bot1?.name || "TBD"}
					</Badge>
					<p>vs</p>
					<Badge
						variant="secondary"
						className={cn("text-lg", bot2 && match.winner?.id === bot2.id && "text-amber-400")}
					>
						{bot2?.name || "TBD"}
					</Badge>
				</div>
				<div className="ml-auto p-1">
					<GripVertical className="h-4 w-4 text-gray-400 hover:bg-transparent" />
				</div>
			</CardContent>
		</Card>
	);
};

export const MatchList = ({
	schedule,
	participants,
	currentMatchId,
}: {
	schedule: Schedule;
	participants: Participant[];
	currentMatchId: string | undefined;
}) => {
	const router = useRouter();
	const [activeId, setActiveId] = useState<string | null>(null);
	const [optimisticMatches, setOptimisticMatches] = useState(schedule.matches);
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 8,
			},
		}),
	);

	// Update optimistic matches when schedule changes
	useEffect(() => {
		setOptimisticMatches(schedule.matches);
	}, [schedule.matches]);

	const handleDragStart = (event: DragStartEvent) => {
		setActiveId(event.active.id as string);
	};

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const draggedMatch = optimisticMatches.find((m) => m.id === active.id);
			// const targetMatch = optimisticMatches.find((m) => m.id === over.id);

			// Prevent dragging matches with winners
			if (draggedMatch?.winner) {
				setActiveId(null);
				return;
			}

			// Prevent dropping above matches that have winners
			const targetIndex = optimisticMatches.findIndex((m) => m.id === over.id);

			// Check if there are any completed matches above the target position
			// We want to prevent dropping above completed matches
			const completedMatchesAbove = optimisticMatches.slice(targetIndex).filter((m) => m.winner);

			// If there are completed matches above the target, prevent the drop
			if (completedMatchesAbove.length > 0) {
				setActiveId(null);
				return;
			}

			const oldIndex = optimisticMatches.findIndex((m) => m.id === active.id);
			const newIndex = optimisticMatches.findIndex((m) => m.id === over.id);

			// Create new array with reordered matches
			const newMatches = [...optimisticMatches];
			const [movedMatch] = newMatches.splice(oldIndex, 1);
			newMatches.splice(newIndex, 0, movedMatch);

			// Optimistically update the UI immediately
			setOptimisticMatches(newMatches);

			// Update the order in the database
			try {
				await updateMatchOrderFn({
					data: {
						scheduleId: schedule.id,
						matchIds: newMatches.map((m) => m.id),
					},
				});
				router.invalidate();
			} catch (error) {
				console.error("Failed to update match order:", error);
				// Revert optimistic update on error
				setOptimisticMatches(schedule.matches);
			}
		}

		setActiveId(null);
	};

	const activeMatch = activeId ? optimisticMatches.find((m) => m.id === activeId) : null;

	const activeMatchBots = activeMatch
		? activeMatch.participants.map((p) => participants.find((part) => part.id === p.id)).filter(Boolean)
		: [];

	// Use default collision detection for better drag experience
	const collisionDetection = closestCenter;

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={collisionDetection}
			onDragStart={handleDragStart}
			onDragEnd={handleDragEnd}
		>
			<SortableContext items={optimisticMatches.map((m) => m.id)} strategy={verticalListSortingStrategy}>
				<div className="space-y-2">
					{optimisticMatches.map((match) => {
						const [bot1, bot2] = match.participants
							.map((p) => {
								return participants.find((part) => part.id === p.id);
							})
							.filter(Boolean);

						return (
							<SortableListItem
								key={match.id}
								schedule={schedule}
								match={match}
								bot1={bot1}
								bot2={bot2}
								currentMatchId={currentMatchId}
							/>
						);
					})}
				</div>
			</SortableContext>

			<DragOverlay>
				{activeMatch && (
					<DraggingListItem
						match={activeMatch}
						bot1={activeMatchBots[0]}
						bot2={activeMatchBots[1]}
						currentMatchId={currentMatchId}
					/>
				)}
			</DragOverlay>
		</DndContext>
	);
};
