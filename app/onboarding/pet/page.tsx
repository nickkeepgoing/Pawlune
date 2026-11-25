import { redirect } from "next/navigation";
import { requireStage } from "@/lib/guard";
import Steps from "@/components/Steps";
import PetForm from "./PetForm";

export default async function PetPage({ searchParams }: PageProps<"/onboarding/pet">) {
  const { user, pet } = await requireStage("ageOk");
  if (pet) redirect("/home");
  const { error } = await searchParams;
  return (
    <>
      <Steps at={3} />
      <h1 className="text-2xl font-semibold">มาแนะนำน้องกัน</h1>
      <p className="mt-1 text-bark">รูปน้องจะอยู่บนหน้าบันทึกทุกวัน และเก็บแบบส่วนตัว</p>
      {error && <p role="alert" className="mt-3 text-sm">กรุณาใส่ชื่อน้อง</p>}
      <PetForm uid={user.id} />
    </>
  );
}
