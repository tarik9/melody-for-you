let displayNames: Intl.DisplayNames | null = null;

export function countryName(code?: string): string {
  if (!code) return "—";

  if (!displayNames) {
    try {
      displayNames = new Intl.DisplayNames(["en"], { type: "region" });
    } catch {
      return code;
    }
  }

  try {
    return displayNames.of(code.toUpperCase()) || code;
  } catch {
    return code;
  }
}
