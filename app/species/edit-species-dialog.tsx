"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { Database } from "@/lib/schema"; // Import the schema
import { toast } from "@/components/ui/use-toast";
import { createBrowserSupabaseClient } from "@/lib/client-utils";
import { useState, type BaseSyntheticEvent } from "react";
import { useRouter } from "next/navigation";

// Define a species type using the generated Database type
type Species = Database["public"]["Tables"]["species"]["Row"];

// Zod schema to validate the form data
const speciesSchema = z.object({
  scientific_name: z.string().min(1).trim(),
  common_name: z.string().nullable().transform((val) => (val === "" ? null : val)),
  kingdom: z.enum(["Animalia", "Plantae", "Fungi", "Protista", "Archaea", "Bacteria"]),
  total_population: z.number().int().positive().nullable(),
  description: z.string().nullable(),
});

type FormData = z.infer<typeof speciesSchema>;

export default function EditSpeciesDialog({ species }: { species: Species }) {
  const router = useRouter();
  const [open, setOpen] = useState<boolean>(false);

  const form = useForm<FormData>({
    resolver: zodResolver(speciesSchema),
    defaultValues: {
      scientific_name: species.scientific_name,
      common_name: species.common_name,
      kingdom: species.kingdom,
      total_population: species.total_population,
      description: species.description,
    },
    mode: "onChange",
  });

  // Submit handler to update species information in Supabase
  const onSubmit = async (input: FormData) => {
    const supabase = createBrowserSupabaseClient();

    const { error } = await supabase
      .from("species")
      .update({
        scientific_name: input.scientific_name,
        common_name: input.common_name,
        kingdom: input.kingdom,
        total_population: input.total_population,
        description: input.description,
      })
      .eq("id", species.id); // Only update species with matching ID

    if (error) {
      return toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }

    form.reset(input);
    setOpen(false);
    router.refresh(); // Refresh the page

    return toast({
      title: "Species Updated",
      description: `${input.scientific_name} has been successfully updated.`,
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="mt-3 w-full" variant="secondary">
          Edit
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Species</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={(e: BaseSyntheticEvent) => void form.handleSubmit(onSubmit)(e)}>
            <div className="grid w-full items-center gap-4">
              <FormField
                control={form.control}
                name="scientific_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Scientific Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="common_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Common Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="kingdom"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Kingdom</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a kingdom" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="Animalia">Animalia</SelectItem>
                          <SelectItem value="Plantae">Plantae</SelectItem>
                          <SelectItem value="Fungi">Fungi</SelectItem>
                          <SelectItem value="Protista">Protista</SelectItem>
                          <SelectItem value="Archaea">Archaea</SelectItem>
                          <SelectItem value="Bacteria">Bacteria</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="total_population"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Population</FormLabel>
                    <FormControl>
                      <Input {...field} type="number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex">
                <Button type="submit" className="ml-1 mr-1 flex-auto">
                  Save Changes
                </Button>
                <DialogClose asChild>
                  <Button type="button" className="ml-1 mr-1 flex-auto" variant="secondary">
                    Cancel
                  </Button>
                </DialogClose>
              </div>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
