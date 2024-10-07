"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Job } from "@prisma/client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Combobox } from "@/components/ui/combo-box";
interface JobWorkExperienceProps {
  initialData: Job;
  jobId: string;
}

const FormSchema = z.object({
  yearsOfExperience: z.string(),
});

let options = [
  {
    value: "0-6 months",
    label: "0-6 Months"
  },
  {
    value: "6-12 months",
    label: "6-12 Months"
  },
  {
    value: "1-3 years",
    label: "1-3 Years"
  },
  {
    value: "3-5 years",
    label: "3-5 Years"
  },
  {
    value: "5-10 years",
    label: "5-10 Years"
  },
  {
    value: "10+ years",
    label: "10+ Years"
  }
]

const JobWorkExperience: React.FC<JobWorkExperienceProps> = ({
  initialData,
  jobId
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      yearsOfExperience: initialData?.yearsOfExperience || "",
    },
  });

  async function onSubmit(formData: z.infer<typeof FormSchema>) {
    try {
      const { data } = await axios.patch(`/api/jobs/${jobId}`, formData);
      console.log(data);
      toggleEditing();
      router.refresh();
    } catch (error) {
      console.log("Error", error);
    }
  }

  const { isSubmitting, isValid } = form.formState;
  const toggleEditing = () => setIsEditing((current) => !current);

  const selectedOption = options.find(
    (option) => option.value === initialData.yearsOfExperience
  );

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Years Of Experience
        <Button onClick={toggleEditing} variant="ghost">
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4 mr-2" />
              Edit
            </>
          )}
        </Button>
      </div>

      {/* Display the yearsOfExperience if not editing */}
      {!isEditing && (
        <p className="text-sm mt-2 text-neutral-500 italic">
          {selectedOption?.label || "No Work Mode Specified"}
        </p>
      )}

      {/* On editing mode display the input */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="yearsOfExperience"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Combobox
                      options={options}
                      value={field.value}
                      onChange={field.onChange}
                      heading="Timing Mode"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};

export default JobWorkExperience;
