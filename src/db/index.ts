import * as z from "zod";
import { FileDB } from "./file";

// Define schemas for different entities
export const ParticipantSchema = z.object({
	id: z.string(),
	type: z.enum(["FEATHERWEIGHT", "HEAVYWEIGHT"]),
	name: z.string().nonempty("Name is required"),
	builders: z.string().nonempty("At least one builder name"),
	weight: z.number().optional(),
	weapon: z.string().optional(),
	videos: z.string().min(0),
	photo: z.string().optional(),
	funFact: z.string().optional(),
	previousRank: z.string().optional(),
	isDead: z.boolean().optional(),
});

export const EventSchema = z.object({
	id: z.string(),
	currentMatchId: z.string().optional(),
	currentScheduleId: z.string().optional(),
	bracketNames: z.array(z.string()),
	qualifyingResults: z.record(
		z.string(),
		z.object({
			wins: z.number(),
			losses: z.number(),
			winsByKO: z.number(),
			winsByJD: z.number(),
			winsByNS: z.number(),
			lossesByKO: z.number(),
			lossesByJD: z.number(),
			lossesByNS: z.number(),
			opponentIds: z.array(z.string()),
		}),
	),
	rankings: z.array(z.object({ id: z.string(), position: z.number() })),
});

const sharedMatchSchema = z.object({
	id: z.string(),
	name: z.string(),
	participants: z.array(
		z.object({ id: z.string().optional(), videoName: z.string().optional() }),
	),
	names: z.array(z.string()).optional(),
	winner: z
		.object({
			id: z.string().optional(),
			condition: z.enum(["KO", "JD", "NS"]).optional(),
		})
		.optional(),
});

export const QualifyingMatchSchema = sharedMatchSchema.extend({
	type: z.literal("QUALIFYING"),
});

export const BracketMatchSchema = sharedMatchSchema.extend({
	type: z.literal("BRACKET"),
	bracket: z.string(),
	round: z.enum(["SF1", "SF2", "Final"]),
});

export const MatchSchema = z.discriminatedUnion("type", [
	QualifyingMatchSchema,
	BracketMatchSchema,
]);

export const ScheduleSchema = z.object({
	id: z.string(),
	name: z.string(),
	type: z.enum(["QUALIFYING", "BRACKET"]),
	matches: z.array(MatchSchema),
});

export type Participant = z.infer<typeof ParticipantSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type QualifyingMatch = z.infer<typeof QualifyingMatchSchema>;
export type BracketMatch = z.infer<typeof BracketMatchSchema>;

export const participantDB = new FileDB(
	"./database/participants.txt",
	ParticipantSchema,
);
export const eventDB = new FileDB("./database/events.txt", EventSchema);
export const scheduleDB = new FileDB(
	"./database/schedules.txt",
	ScheduleSchema,
);
