import EditProfile from "@/app/_components-profile/edit-profile";
import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function EditProfilePage() {
  const supabase = createServerSupabaseClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect unauthenticated users to home page
  if (!session) {
    redirect("/");
  }

  return <EditProfile />;
}
