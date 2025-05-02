import * as z from "zod";
import { FileDB } from "./file";

// Define schemas for different entities
const ParticipantSchema = z.object({
	id: z.string(),
	name: z.string(),
	builders: z.array(z.string()),
	weight: z.number().optional(),
});

const EventSchema = z.object({
	id: z.string(),
	name: z.string(),
	date: z.string(), // ISO date string
	location: z.string(),
});

export const participantDB = new FileDB(
	"./database/participants.txt",
	ParticipantSchema,
);
export const eventDB = new FileDB("./database/events.txt", EventSchema);
