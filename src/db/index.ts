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
	isCompeting: z.boolean(),
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

export const QualifyingMatchSchema = sharedMatchSchema;
export const TeamMatchSchema = sharedMatchSchema;
export const ExhibitionMatchSchema = sharedMatchSchema;

export const BracketMatchSchema = sharedMatchSchema.extend({
	bracket: z.string(),
	round: z.enum(["SF1", "SF2", "Final"]),
});

export const MatchSchema = z.union([QualifyingMatchSchema, BracketMatchSchema]);

const TeamsMatchBot = z
	.object({
		id: z.string().optional(),
		isDead: z.boolean().optional(),
		isActive: z.boolean().optional(),
		videoName: z.string().optional(),
	})
	.optional();

export const TeamsMatchTeamSchema = z.object({
	bot1: TeamsMatchBot,
	bot2: TeamsMatchBot,
	bot3: TeamsMatchBot,
	bot4: TeamsMatchBot,
	bot5: TeamsMatchBot,
});

export const TeamsMatchSchema = z.object({
	type: z.literal("TEAMS"),
	id: z.string(),
	name: z.string(),
	team1Name: z.string(),
	team2Name: z.string(),
	team1bots: TeamsMatchTeamSchema,
	team2bots: TeamsMatchTeamSchema,
	matches: z.array(TeamMatchSchema),
});

export const ScheduleSchema = z.discriminatedUnion("type", [
	z.object({
		type: z.literal("QUALIFYING"),
		id: z.string(),
		name: z.string(),
		matches: z.array(QualifyingMatchSchema),
	}),
	z.object({
		type: z.literal("BRACKET"),
		id: z.string(),
		name: z.string(),
		matches: z.array(BracketMatchSchema),
	}),
	z.object({
		type: z.literal("EXHIBITION"),
		id: z.string(),
		name: z.string(),
		matches: z.array(ExhibitionMatchSchema),
	}),
	TeamsMatchSchema,
]);

export type Participant = z.infer<typeof ParticipantSchema>;
export type Event = z.infer<typeof EventSchema>;
export type Schedule = z.infer<typeof ScheduleSchema>;
export type TeamsSchedule = z.infer<typeof TeamsMatchSchema>;
export type BracketSchedule = z.infer<typeof BracketMatchSchema>;
export type ExhibitionSchedule = z.infer<typeof ExhibitionMatchSchema>;
export type QualifyingSchedule = z.infer<typeof QualifyingMatchSchema>;
export type Match = z.infer<typeof MatchSchema>;
export type QualifyingMatch = z.infer<typeof QualifyingMatchSchema>;
export type BracketMatch = z.infer<typeof BracketMatchSchema>;

export const participantDB = new FileDB(
	"./database/participants.json",
	ParticipantSchema,
);
export const eventDB = new FileDB("./database/events.json", EventSchema);
export const scheduleDB = new FileDB(
	"./database/schedules.json",
	ScheduleSchema,
);
