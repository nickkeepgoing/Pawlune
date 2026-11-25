import "server-only";

/** The ONLY source of "today": Asia/Bangkok calendar date, computed on the server. */
export function todayInBangkok(now: Date = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: process.env.APP_TIMEZONE || "Asia/Bangkok",
    year: "numeric", month: "2-digit", day: "2-digit",
  }).format(now);
}
