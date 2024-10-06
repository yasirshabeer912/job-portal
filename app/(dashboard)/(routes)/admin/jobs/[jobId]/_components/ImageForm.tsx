"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Edit2Icon, ImageIcon, Pencil } from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Job } from "@prisma/client";
import Image from "next/image";
import ImageUpload from "@/components/ui/image-upload-firebase";
interface ImageFormProps {
  initialData: Job;
  jobId: string;
}
const FormSchema = z.object({
  imageUrl: z.string(),
});

const ImageForm: React.FC<ImageFormProps> = ({ initialData, jobId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
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
  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Cover Image
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

      {/* display the imageUrl if not editing */}
      {!isEditing && (!initialData.imageUrl ? (
        <div className="flex justify-center items-center h-60 bg-neutral-200 rounded-md">
          <ImageIcon className="h-10 w-10 text-neutral-500" />
        </div>
      ) : (
        <div className="relative aspect-video mt-2">
          <Image
            alt="Cover Image"
            fill
            className="w-full h-full object-cover"
            src={initialData?.imageUrl || ""}
          />
        </div>
      ))}

      {/* on editing mode display the input */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value || ""}
                      disabled={isSubmitting}
                      onChange={(url) => field.onChange(url)}
                      onRemove={() => field.onChange("")}
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

export default ImageForm;
