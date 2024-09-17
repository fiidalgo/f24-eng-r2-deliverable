"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DeleteSpeciesDialog({ speciesId }: { speciesId: number }) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = createBrowserSupabaseClient();

  // Function to delete the species
  const handleDelete = async () => {
    const { error } = await supabase.from("species").delete().eq("id", speciesId);

    if (error) {
      return toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    // Close the dialog, refresh the page show success toast
    setOpen(false);
    router.refresh();
    toast({
      title: "Species Deleted",
      description: "The species has been successfully deleted.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="secondary" className="mt-3 w-full">
          Delete
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Deletion</DialogTitle>
        </DialogHeader>
        <p>Are you sure you want to delete this species? This action cannot be undone.</p>

        <div className="mt-4 flex justify-end gap-2">
          {/* Cancel Button */}
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>

          {/* Confirm Delete Button */}
          <Button onClick={void handleDelete} variant="destructive">
            Delete
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
