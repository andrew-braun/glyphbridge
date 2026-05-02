/** Joins truthy class name tokens into a single space-separated string. */
export function cn(...classes: (string | false | null | undefined)[]): string {
	return classes.filter(Boolean).join(" ");
}
