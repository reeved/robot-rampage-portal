import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

export function generateId(prefix?: string) {
	const id = Math.random().toString(36).substring(2, 9);

	if (prefix) {
		return `${prefix}-${id}`;
	}
	return id;
}
