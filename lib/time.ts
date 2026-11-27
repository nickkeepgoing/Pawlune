import 'server-only';

/** The ONLY source of "today" in the app: Asia/Bangkok calendar date computed on the server. */
export function todayInBangkok(): string {
  const tz = process.env.APP_TIMEZONE || 'Asia/Bangkok';
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(new Date());
}
