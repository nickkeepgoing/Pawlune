// Hand-written from supabase/migrations/0001_init.sql.
// Regenerate with: npx supabase gen types typescript --project-id <id> > lib/database.types.ts
type Table<Row, Insert> = { Row: Row; Insert: Insert; Update: Partial<Insert>; Relationships: [] };

export type ProfileRow = {
  id: string; display_name: string | null; consent_version: string | null; consented_at: string | null;
  age_confirmed_20plus: boolean; is_demo: boolean; created_at: string;
};
export type PetRow = {
  id: string; user_id: string; name: string; species: "dog" | "cat" | "other"; photo_path: string | null;
  adopted_on: string | null; is_current: boolean; past_period: string | null; past_feeling: number | null;
  past_tags: string[]; memory_note: string | null; created_at: string;
};
export type CheckinRow = {
  id: string; user_id: string; pet_id: string | null; checkin_date: string; mood: number; activities: string[];
  note: string | null; created_at: string; updated_at: string;
};
export type Who5Row = { id: string; user_id: string; taken_on: string; items: number[]; raw: number; pct: number; created_at: string };

export type Database = {
  public: {
    Tables: {
      profiles: Table<ProfileRow, Partial<ProfileRow> & { id: string }>;
      pets: Table<PetRow, Partial<PetRow> & { user_id: string; name: string; species: PetRow["species"] }>;
      checkins: Table<CheckinRow, Partial<CheckinRow> & { user_id: string; checkin_date: string; mood: number }>;
      who5_entries: Table<Who5Row, { user_id: string; taken_on: string; items: number[]; id?: string; created_at?: string }>;
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
