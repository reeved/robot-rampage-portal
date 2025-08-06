import * as fs from "node:fs";
import path from "node:path";
import type * as z from "zod";

export class FileDB<Schema extends z.ZodTypeAny, RecordType = z.infer<Schema>> {
	private filePath: string;
	private schema: Schema;

	constructor(filePath: string, schema: Schema) {
		this.filePath = filePath;
		this.schema = schema;
	}

	// Ensure the file exists
	private async ensureFileExists(): Promise<void> {
		try {
			await fs.promises.access(this.filePath);
		} catch {
			try {
				// Ensure the directory exists
				const dir = path.dirname(this.filePath);
				fs.mkdirSync(dir, { recursive: true });
				// Create the file
				fs.writeFileSync(this.filePath, JSON.stringify([]));
			} catch (error) {
				console.error("Error writing file:", error);
			}
		}
	}

	// Read all records from the file
	private async readData(): Promise<RecordType[]> {
		await this.ensureFileExists();
		const data = await fs.promises.readFile(this.filePath, "utf-8");
		return JSON.parse(data);
	}

	// Write all records to the file
	private async writeData(data: RecordType[]): Promise<void> {
		await fs.promises.writeFile(this.filePath, JSON.stringify(data, null, 2));
	}

	// Find records based on a filter function
	async find(filterFn: (record: RecordType) => boolean): Promise<RecordType[]> {
		const data = await this.readData();
		return data.filter(filterFn);
	}

	async findOne<T = RecordType>(filterFn: (record: RecordType) => boolean): Promise<T | null> {
		const data = await this.readData();
		const result = data.find(filterFn);
		return result ? (result as T) : null;
	}

	// Update a single record based on a filter function
	async updateOne(filterFn: (record: RecordType) => boolean, updates: Partial<RecordType>): Promise<boolean> {
		const data = await this.readData();
		const index = data.findIndex(filterFn);

		if (index === -1) return false;

		data[index] = { ...data[index], ...updates };
		this.schema.parse(data[index]); // Validate with the schema
		await this.writeData(data);
		return true;
	}

	// Update multiple records based on a filter function
	async updateMany(filterFn: (record: RecordType) => boolean, updates: Partial<RecordType>): Promise<number> {
		const data = await this.readData();
		let updatedCount = 0;

		const updatedData = data.map((record) => {
			if (filterFn(record)) {
				updatedCount++;
				const updatedRecord = { ...record, ...updates };
				this.schema.parse(updatedRecord); // Validate with the schema
				return updatedRecord;
			}
			return record;
		});

		await this.writeData(updatedData);
		return updatedCount;
	}

	// Insert a new record
	async insert(record: RecordType): Promise<void> {
		this.schema.parse(record); // Validate with the schema
		const data = await this.readData();
		data.push(record);
		await this.writeData(data);
	}

	// Delete records based on a filter function
	async delete(filterFn: (record: RecordType) => boolean): Promise<number> {
		const data = await this.readData();
		const initialLength = data.length;
		const filteredData = data.filter((record) => !filterFn(record));
		await this.writeData(filteredData);
		return initialLength - filteredData.length;
	}
}
