"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lightbulb, Loader2, Pencil } from "lucide-react";
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
interface CategoryFormProps {
  initialData: Job;
  jobId: string;
}

const FormSchema = z.object({
  short_description: z.string(),
});

const CategoryForm: React.FC<CategoryFormProps> = ({ initialData, jobId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [prompting, setPrompting] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      short_description: initialData?.short_description || "",
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


  const handlePromptGenerating  = async ()=>{
    setPrompting(true)
    try {
      const cusomPrompt = `Could you craft a concise job description for a ${prompt} position in fewer than 400 characters?`;
      await getGenerativeAIResponse(cusomPrompt).then((data)=>{
        form.setValue('short_description',data)
        setPrompting(false)
      })
    } catch (error) {
      console.log(error);
      toast.error("Error Generating Prompt")
    }
  }
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Short Description
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

      {/* Display the short_description if not editing */}
      {!isEditing && (
        <p className="text-sm mt-2 text-neutral-500 italic">
          {initialData.short_description}
        </p>
      )}

      {/* On editing mode display the input */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2">
            <input
              type="text"
              placeholder="e.g. Full-Stack Developer"
              className="w-full p-2 rounded-md"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
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
            <Lightbulb  className="w-4 h-4" />   
          </Button>
            </>
          )}
          </div>
          <p className="text-xs text-muted-foreground text-right">Note: Write Profession to Generate it</p>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Textarea disabled={isSubmitting} placeholder="Short Description for job" {...field} />
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

export default CategoryForm;
