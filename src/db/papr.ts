import { MongoClient } from "mongodb";
import Papr from "papr";

export let client: MongoClient;

const papr = new Papr();

export async function connect() {
	try {
		client = await MongoClient.connect("mongodb://localhost:27026");
		await papr.initialize(client.db("robot-rampage"));
		await papr.updateSchemas();
		return client;
	} catch (error) {
		console.error("Failed to connect to MongoDB:", error);
		throw error;
	}
}

export async function disconnect() {
	console.log("Disconnecting from MongoDB...");
	await client.close();
}

export default papr;
