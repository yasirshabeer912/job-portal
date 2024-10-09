"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
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
import { Textarea } from "@/components/ui/textarea";
import getGenerativeAIResponse from "@/scripts/aistudio";
import toast from "react-hot-toast";
import { RichEditor } from "./RichEditor";
import { cn } from "@/lib/utils";
import { Preview } from "@/components/Preview";
interface JobDescriptionProps {
  initialData: Job;
  jobId: string;
}

const FormSchema = z.object({
  description: z.string(),
});

const JobDescription: React.FC<JobDescriptionProps> = ({ initialData, jobId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [rollname, setRollname] = useState("");
  const [skills, setSkills] = useState("");
  const [aiValue, setAiValue] = useState("")
  const [prompting, setPrompting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      description: initialData?.description || "",
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


  const handlePromptGenerating = async () => {
    setPrompting(true);
    try {
      const job_description = `Could you please draft a job requirements document for the position of ${rollname}? The job description should include roles & responsibilities, key features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skill related to the job. Thanks!`;
      
      await getGenerativeAIResponse(job_description).then((data) => {
        // Remove leading/trailing single quotes and special characters like **#1, and any other unwanted characters
        let cleanedText = data
          .replace(/^'|'$/g, "")       // Removes single quotes
          .replace(/\*\*#1/g, "")      // Removes occurrences of **#1
          .replace(/[#\*\(\)]/g, "")   // Remove other unwanted special characters like #, *, ()
          .trim();                     // Trim extra spaces and newlines
  
        // Set the cleaned text to aiValue state
        setAiValue(cleanedText);
        setPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Error Generating Prompt");
    }
  };
  

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to Clipboard")
  }
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
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

      {!isEditing && (
        <div className={cn("text-sm mt-2", initialData.description && "text-neutral-500 italic")}>
          {!initialData.description && "No Description"}
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}


      {/* On editing mode display the input */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="Job Profession"
              className="w-full p-2 rounded-md"
              value={rollname}
              onChange={(e) => setRollname(e.target.value)}
            />
            <input
              type="text"
              placeholder="Required Skills Set "
              className="w-full p-2 rounded-md"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            {prompting ? (
              <>
                <Button>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGenerating}>
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">Note: Write Profession to Generate it</p>

          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}

              <Button onClick={onCopy} className="absolute top-3 right-3 z-10" variant={"outline"} size={"icon"} >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <RichEditor {...field} />
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
        </>
      )}
    </div>
  );
};

export default JobDescription;
