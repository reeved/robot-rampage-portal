import * as z from "zod";
import { FileDB } from "./file";

// Define schemas for different entities
export const ParticipantSchema = z.object({
	id: z.string(),
	name: z.string().nonempty("Name is required"),
	builders: z.string().nonempty("At least one builder name"),
	weight: z.number().optional(),
	images: z.array(z.string()),
});

export const EventSchema = z.object({
	id: z.string(),
	name: z.string(),
	date: z.string(), // ISO date string
	location: z.string(),
});

export type Participant = z.infer<typeof ParticipantSchema>;
export type Event = z.infer<typeof EventSchema>;

export const participantDB = new FileDB(
	"./database/participants.txt",
	ParticipantSchema,
);
export const eventDB = new FileDB("./database/events.txt", EventSchema);
