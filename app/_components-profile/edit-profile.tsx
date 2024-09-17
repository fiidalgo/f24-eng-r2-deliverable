"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { createBrowserSupabaseClient } from "@/lib/client-utils"; // Adjust import path as necessary
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast"; // Optional for user feedback

interface Profile {
  id: string;
  display_name: string;
  biography: string;
  email: string;
}

// Define the shape of the form data
interface FormData {
  biography: string;
}

export default function EditProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const supabase = createBrowserSupabaseClient();

  // Use the FormData type to tell useForm what structure to expect
  const { register, handleSubmit, reset } = useForm<FormData>();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        console.error("User is not authenticated");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
      } else {
        const updatedProfile = {
          ...data,
          biography: data.biography ?? "", // Ensure biography is a string
        };

        setProfile(updatedProfile);
        reset(updatedProfile); // Initialize form with existing profile data
      }
      setLoading(false);
    };

    void fetchProfile();
  }, [supabase, reset]);

  const onSubmit = async (formData: FormData) => {
    if (!profile) return;

    const { error } = await supabase
      .from("profiles")
      .update({ biography: formData.biography })
      .eq("id", profile.id);

    if (error) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: "Failed to update profile.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Success",
        description: "Profile updated successfully!",
      });
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      {profile && (
        <form onSubmit={void handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="biography" className="block font-semibold mb-2">
              Biography
            </label>
            <textarea
              id="biography"
              {...register("biography")}
              className="border rounded w-full p-2"
              rows={5}
              defaultValue={profile.biography}
            ></textarea>
          </div>
          <Button type="submit" className="w-full">
            Save Changes
          </Button>
        </form>
      )}
    </div>
  );
}
