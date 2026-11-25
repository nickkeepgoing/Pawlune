import { requireStage } from "@/lib/guard";
import { petPhotoUrl } from "@/lib/data";
import { todayInBangkok } from "@/lib/time";
import CheckinForm from "./CheckinForm";

export default async function CheckinPage({ searchParams }: PageProps<"/checkin">) {
  const { supabase, user, pet } = await requireStage("ready");
  const today = todayInBangkok();
  const [photo, { data: existing }] = await Promise.all([
    petPhotoUrl(supabase, pet.photo_path),
    supabase.from("checkins").select("mood, activities, note").eq("user_id", user.id).eq("checkin_date", today).maybeSingle(),
  ]);
  const { error } = await searchParams;
  const d = new Date(today + "T00:00:00Z").toLocaleDateString("th-TH", { weekday: "long", day: "numeric", month: "long", timeZone: "UTC" });
  return (
    <>
      <h1 className="sr-only">บันทึกวันนี้</h1>
      {error && <p role="alert" className="mb-3 rounded-xl bg-paper p-3">กรุณาเลือกอารมณ์วันนี้ก่อนบันทึก</p>}
      <CheckinForm petName={pet.name} species={pet.species} photo={photo} dateLabel={d} existing={existing} />
    </>
  );
}
