type ClassValue = string | number | false | null | undefined;

/** Joins truthy class names. No new dependency needed for something this small. */
export function cn(...values: ClassValue[]): string {
  return values.filter((value) => typeof value === "string" && value.length > 0).join(" ");
}
