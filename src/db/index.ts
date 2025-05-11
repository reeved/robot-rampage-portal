import * as z from "zod";
import { FileDB } from "./file";

// Define schemas for different entities
export const ParticipantSchema = z.object({
	id: z.string(),
	name: z.string().nonempty("Name is required"),
	builders: z.string().nonempty("At least one builder name"),
	weight: z.number().optional(),
	weapon: z.string().optional(),
	videos: z.string().min(0),
});

export const EventSchema = z.object({
	id: z.string(),
	name: z.string(),
	date: z.string(), // ISO date string
	location: z.string(),
	upcomingMatchId: z.string().optional(),
	currentMatchId: z.string().optional(),
});

export const MatchSchema = z.object({
	id: z.string(),
	name: z.string(),
	participants: z.array(z.string()),
	winner: z
		.object({
			id: z.string(),
			condition: z.enum(["KO", "JD", "NS"]),
		})
		.optional(),
});

export const ScheduleSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["QUALIFYING", "BRACKET"]),
	matches: z.array(MatchSchema),
});

export type Participant = z.infer<typeof ParticipantSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;

export const participantDB = new FileDB(
	"./database/participants.txt",
	ParticipantSchema,
);
export const eventDB = new FileDB("./database/events.txt", EventSchema);
export const scheduleDB = new FileDB(
	"./database/schedules.txt",
	ScheduleSchema,
);
