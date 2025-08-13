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

// Create a sophisticated border effect using multiple drop-shadows
export const createBorderEffect = (): string => {
	// Create multiple drop-shadows with increasing blur radius to create a more defined border
	const shadows = [
		"drop-shadow(0 0 1px currentColor)",
		"drop-shadow(0 0 2px currentColor)",
		"drop-shadow(0 0 3px currentColor)",
		"drop-shadow(0 0 4px currentColor)",
		"drop-shadow(0 0 5px currentColor)",
		// `drop-shadow(0 0 8px currentColor)`,
		// `drop-shadow(0 0 10px currentColor)`,
		// `drop-shadow(0 0 12px currentColor)`,
		// `drop-shadow(0 0 14px currentColor)`,
		// `drop-shadow(0 0 16px currentColor)`,
	];

	return shadows.join(" ");
};
