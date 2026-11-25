import AppHeader from "@/components/AppHeader";
import { requireStage } from "@/lib/guard";

export default async function OnboardingLayout({ children }: LayoutProps<"/onboarding">) {
  const { profile } = await requireStage("signedIn");
  return (
    <>
      <AppHeader isDemo={!!profile?.is_demo} settings={false} />
      <main className="mx-auto w-full max-w-md flex-1 px-4 pb-12">{children}</main>
    </>
  );
}
