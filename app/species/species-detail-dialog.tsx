"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import type { Database } from "@/lib/schema"; // Import the schema

// Define a species type using the generated Database type
type Species = Database["public"]["Tables"]["species"]["Row"];

// New SpeciesDetailsDialog component to show detailed information about a species
export default function SpeciesDetailsDialog({ species }: { species: Species }) {
  return (
    <Dialog>
      {/* Trigger button to open the dialog */}
      <DialogTrigger asChild>
        <Button className="mt-3 w-full">Learn more</Button>
      </DialogTrigger>

      {/* Dialog content for the species details */}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Species Details</DialogTitle>
        </DialogHeader>

        {/* Display species details here */}
        <div className="space-y-2">
          <p>
            <strong>Scientific Name:</strong> {species.scientific_name}
          </p>
          <p>
            <strong>Common Name:</strong> {species.common_name ?? "N/A"}
          </p>
          <p>
            <strong>Kingdom:</strong> {species.kingdom}
          </p>
          <p>
            <strong>Total Population:</strong> {species.total_population?.toLocaleString() ?? "N/A"}
          </p>
          <p>
            <strong>Description:</strong> {species.description ?? "No description available."}
          </p>
        </div>

        {/* Close button */}
        <DialogClose asChild>
          <Button type="button" variant="secondary">
            Close
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
