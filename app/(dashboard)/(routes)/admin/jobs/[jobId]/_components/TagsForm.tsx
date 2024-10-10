"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
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
interface TagsFormProps {
  initialData: Job;
  jobId: string;
}

const FormSchema = z.object({
  tags: z.array(z.string()).min(1),
});

const TagsForm: React.FC<TagsFormProps> = ({ initialData, jobId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [prompting, setPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags)
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      tags: initialData?.tags || "",
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
    setPrompting(true)
    try {
      const job_tags = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;
      await getGenerativeAIResponse(job_tags).then((data) => {
        // form.setValue('tags', data)

        if (Array.isArray(JSON.parse(data))) {
          setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)])
        }
        setPrompting(false)
      })
    } catch (error) {
      console.log(error);
      toast.error("Error Generating Prompt")
    }
  }

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags]
    updatedTags.splice(index, 1);
    setJobTags(updatedTags)
  };
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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

      {/* display the tags if not editing */}
      {!isEditing && (
        <div className="flex items-center flex-wrap gap-2">
          {initialData.tags.length > 0 ? (
            initialData.tags.map((tag, index) => (
              <div
                className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                key={index}
              >
                {tag}
              </div>
            ))
          ) : (
            <p>No tags</p>
          )}
        </div>
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
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">Note: Write Profession Generate Tags</p>

          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.length > 0 ? (

              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tag}{" "}
                  {isEditing && (
                    <Button
                      variant="ghost"
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))

            ) : (<> No Tags</>)}
          </div>

          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => onSubmit({ tags: jobTags })}
            >
              Save
            </Button>
          </div>



        </>
      )}
    </div>
  );
};

export default TagsForm;
