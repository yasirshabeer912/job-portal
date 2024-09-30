"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Edit2Icon, Pencil } from "lucide-react";
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
interface JobTitleProps {
    initialData: {
        title: string;
    };
    jobId: string;
}
const FormSchema = z.object({
    title: z.string(),
});

const JobTitle: React.FC<JobTitleProps> = ({ initialData, jobId }) => {
    const [isEditing, setIsEditing] = useState(false);
    const router = useRouter();
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: initialData,
    });

     async function onSubmit(formData: z.infer<typeof FormSchema>) {
       try {
        const {data} = await axios.patch(`/api/jobs/${jobId}`,formData)
        console.log(data)
        toggleEditing();
        router.refresh();
       } catch (error) {
        console.log('Error', error)
       }
    }
    const { isSubmitting, isValid } = form.formState;
    const toggleEditing = () => setIsEditing((current) => !current);
    return (
        <div className="mt-6 border bg-neutral-100 rounded-md p-4">
            <div className="font-medium flex items-center justify-between">
                Job Title
                <Button onClick={toggleEditing} variant="ghost">
                    {isEditing ? (
                        <>Cancel</>
                    ) : (
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit Title
                        </>
                    )}
                </Button>
            </div>

            {/* display the title if not editing */}
            {!isEditing && <p className="text-sm mt-2">{initialData.title}</p>}

            {/* on editing mode display the input */}
            {isEditing && (
                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-4 mt-4"
                    >
                        <FormField
                            control={form.control}
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="E.g 'Full-stack developer'"
                                            {...field}
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

export default JobTitle;
