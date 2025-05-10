import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { type Participant, type Schedule, ScheduleSchema } from "@/db";
import { zodResolver } from "@hookform/resolvers/zod";
import {
	CheckCircle2Icon,
	PlusIcon,
	Trash2Icon,
	TrophyIcon,
	UserIcon,
} from "lucide-react";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";

export const QualifyingForm = ({
	participants,
	onSubmit,
	defaultValues,
}: {
	participants: Array<Participant>;
	onSubmit: (data: Schedule) => void;
	defaultValues: Schedule;
}) => {
	const [matchWinners, setMatchWinners] = useState<Record<number, string>>({});
	const [isAddingParticipant, setIsAddingParticipant] = useState<
		Record<number, boolean>
	>({});

	const form = useForm<Schedule>({
		defaultValues,
		resolver: zodResolver(ScheduleSchema),
	});

	// Use field array to manage the matches
	const { fields, append, remove } = useFieldArray({
		control: form.control,
		name: "matches",
	});

	// Add a new match
	const addMatch = () => {
		append({
			id: Date.now().toString(),
			name: `Match ${fields.length + 1}`,
			participants: [],
		});
	};

	// Toggle winner status for a participant
	const toggleWinner = (matchIndex: number, participantId: string) => {
		setMatchWinners((prev) => {
			// If this participant is already the winner, remove them
			if (prev[matchIndex] === participantId) {
				const newWinners = { ...prev };
				delete newWinners[matchIndex];
				return newWinners;
			}
			// Otherwise make them the winner
			return { ...prev, [matchIndex]: participantId };
		});
	};

	// Toggle the add participant state
	const toggleAddParticipant = (matchIndex: number) => {
		setIsAddingParticipant((prev) => ({
			...prev,
			[matchIndex]: !prev[matchIndex],
		}));
	};

	// Get filtered participants that aren't already in the match
	const getFilteredParticipants = (matchIndex: number) => {
		const matchParticipantIds =
			form.watch(`matches.${matchIndex}.participants`) || [];
		return participants.filter((p) => !matchParticipantIds.includes(p.id));
	};

	// Calculate the number of matches each participant is in
	const calculateParticipantMatchCounts = () => {
		const participantMatchCounts: Record<string, number> = {};

		// Initialize counts for all participants
		for (const participant of participants) {
			participantMatchCounts[participant.id] = 0;
		}

		// Count matches for each participant
		const matches = form.watch("matches");
		for (const match of matches) {
			for (const participantId of match.participants) {
				if (participantMatchCounts[participantId] !== undefined) {
					participantMatchCounts[participantId]++;
				}
			}
		}

		return participantMatchCounts;
	};

	const participantMatchCounts = calculateParticipantMatchCounts();

	return (
		<div className="flex gap-6">
			<Form {...form}>
				<form
					onSubmit={form.handleSubmit(onSubmit)}
					className="p-4 gap-y-4 flex flex-col items-start flex-1"
				>
					<FormField
						name="name"
						control={form.control}
						render={({ field }) => (
							<FormItem className="w-full">
								<FormLabel>Name</FormLabel>
								<FormControl>
									<Input {...field} placeholder="Enter schedule name" />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>

					<div className="w-full">
						<div className="flex justify-between items-center mb-2">
							<p className="font-bold">Matches</p>
							<Button
								type="button"
								variant="outline"
								size="sm"
								onClick={addMatch}
								className="flex items-center gap-1"
							>
								<PlusIcon className="h-4 w-4" />
								Add Match
							</Button>
						</div>

						{fields.length === 0 && (
							<p className="text-sm text-muted-foreground">
								No matches added yet. Click "Add Match" to create one.
							</p>
						)}

						<div className="space-y-4 mt-2">
							{fields.map((field, index) => (
								<div key={field.id} className="border p-4 rounded-md">
									<div className="flex justify-between items-center mb-3">
										<h4 className="font-medium">Match {index + 1}</h4>
										<Button
											type="button"
											variant="ghost"
											size="sm"
											onClick={() => remove(index)}
											className="h-8 w-8 p-0"
										>
											<Trash2Icon className="h-4 w-4" />
										</Button>
									</div>

									<div className="space-y-4">
										<FormField
											name={`matches.${index}.name`}
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<FormLabel>Match Name</FormLabel>
													<FormControl>
														<Input {...field} placeholder="Enter match name" />
													</FormControl>
													<FormMessage />
												</FormItem>
											)}
										/>

										<FormField
											name={`matches.${index}.participants`}
											control={form.control}
											render={({ field }) => (
												<FormItem>
													<div className="flex justify-between items-center mb-2">
														<FormLabel className="text-lg font-semibold flex items-center gap-2 mb-0">
															<UserIcon className="h-5 w-5" />
															Participants
														</FormLabel>
														{matchWinners[index] && (
															<div className="flex items-center text-amber-500 gap-1 text-sm">
																<TrophyIcon className="h-4 w-4" />
																<span>Winner selected</span>
															</div>
														)}
													</div>

													<div className="flex flex-wrap items-start gap-2 mt-2">
														{/* Participant cards */}
														{field.value?.map((participantId) => {
															const participant = participants.find(
																(p) => p.id === participantId,
															);
															const isWinner =
																matchWinners[index] === participantId;

															return (
																<div
																	key={participantId}
																	className={`border rounded-lg flex flex-col w-48 overflow-hidden transition-all ${
																		isWinner
																			? "border-amber-400 bg-amber-50 shadow-md"
																			: "border-gray-200 hover:border-primary/30"
																	}`}
																>
																	<div className="p-3">
																		<div className="font-medium mb-1 flex items-center gap-2">
																			<UserIcon className="h-4 w-4 text-primary/70" />
																			{participant?.name || participantId}
																		</div>

																		<div className="flex justify-between items-center mt-2">
																			<Button
																				type="button"
																				variant={
																					isWinner ? "default" : "outline"
																				}
																				size="sm"
																				className={`flex items-center gap-1 ${
																					isWinner
																						? "bg-amber-500 hover:bg-amber-600"
																						: ""
																				}`}
																				onClick={() =>
																					toggleWinner(index, participantId)
																				}
																			>
																				<TrophyIcon className="h-3.5 w-3.5" />
																				{isWinner ? "Winner" : "Mark Winner"}
																			</Button>

																			<Button
																				type="button"
																				variant="ghost"
																				size="sm"
																				className="h-7 w-7 p-0 text-destructive/70 hover:text-destructive hover:bg-destructive/10"
																				onClick={() => {
																					// Remove from winners if this was the winner
																					if (
																						matchWinners[index] ===
																						participantId
																					) {
																						setMatchWinners((prev) => {
																							const newWinners = { ...prev };
																							delete newWinners[index];
																							return newWinners;
																						});
																					}

																					// Remove from participants
																					const newValues = field.value.filter(
																						(id) => id !== participantId,
																					);
																					field.onChange(newValues);
																				}}
																			>
																				<Trash2Icon className="h-3.5 w-3.5" />
																			</Button>
																		</div>
																	</div>
																	{isWinner && (
																		<div className="bg-amber-500 text-white text-xs py-1 px-2 text-center">
																			Match Winner
																		</div>
																	)}
																</div>
															);
														})}

														{/* Add participant card or button */}
														{isAddingParticipant[index] ? (
															<div className="border rounded-lg w-48 p-3">
																<div className="font-medium mb-2">
																	Add Participant
																</div>
																<FormControl>
																	<Select
																		onValueChange={(value) => {
																			// Add the participant
																			const values = field.value || [];
																			field.onChange([...values, value]);
																			// Close the add dialog
																			toggleAddParticipant(index);
																		}}
																		value=""
																	>
																		<SelectTrigger className="w-full border">
																			<SelectValue placeholder="Select..." />
																		</SelectTrigger>
																		<SelectContent>
																			{getFilteredParticipants(index).length >
																			0 ? (
																				getFilteredParticipants(index).map(
																					(participant) => (
																						<SelectItem
																							key={participant.id}
																							value={participant.id}
																							className="py-1.5"
																						>
																							{participant.name}
																						</SelectItem>
																					),
																				)
																			) : (
																				<div className="px-2 py-1.5 text-sm text-muted-foreground">
																					All participants added
																				</div>
																			)}
																		</SelectContent>
																	</Select>
																</FormControl>
																<div className="flex justify-between mt-2">
																	<Button
																		type="button"
																		variant="ghost"
																		size="sm"
																		onClick={() => toggleAddParticipant(index)}
																	>
																		Cancel
																	</Button>
																</div>
															</div>
														) : (
															<Button
																type="button"
																variant="outline"
																size="sm"
																className="h-[104px] w-48 flex flex-col items-center justify-center gap-1 border-dashed"
																onClick={() => toggleAddParticipant(index)}
																disabled={
																	getFilteredParticipants(index).length === 0
																}
															>
																<PlusIcon className="h-5 w-5" />
																<span>Add Participant</span>
															</Button>
														)}
													</div>

													{!field.value?.length &&
														!isAddingParticipant[index] && (
															<p className="text-muted-foreground italic mt-2">
																No participants added yet
															</p>
														)}
													<FormMessage />
												</FormItem>
											)}
										/>
									</div>
								</div>
							))}
						</div>
					</div>

					<Button type="submit" className="mt-4">
						Submit
					</Button>
				</form>
			</Form>

			<div className="w-72 p-4">
				<Card className="sticky top-4">
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<UserIcon className="h-5 w-5" />
							Participants
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="space-y-1">
							{participants.map((participant) => (
								<div
									key={participant.id}
									className="flex justify-between items-center py-2 border-b last:border-0"
								>
									<span className="font-medium">{participant.name}</span>
									<Badge
										variant={
											participantMatchCounts[participant.id] > 0
												? "default"
												: "outline"
										}
									>
										{participantMatchCounts[participant.id]}{" "}
										{participantMatchCounts[participant.id] === 1
											? "match"
											: "matches"}
									</Badge>
								</div>
							))}

							{participants.length === 0 && (
								<p className="text-sm text-muted-foreground italic">
									No participants available
								</p>
							)}
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
};
