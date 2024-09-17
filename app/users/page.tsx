import { createServerSupabaseClient } from "@/lib/server-utils";
import { redirect } from "next/navigation";

export default async function UsersList() {
  // Create supabase client
  const supabase = createServerSupabaseClient();

  // Get current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Redirect if not logged in
  if (!session) {
    redirect("/");
  }

  // Fetch all profiles from Supabase
  const { data: profiles } = await supabase.from("profiles").select("email, display_name, biography");

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Users List</h1>
      <div className="grid gap-4">
        {profiles?.map((profile) => (
          <div key={profile.email} className="p-4 border rounded shadow">
            <h2 className="text-xl font-semibold">{profile.display_name}</h2>
            <p><strong>Email:</strong> {profile.email}</p>
            <p><strong>Biography:</strong> {profile.biography || "No biography available"}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
