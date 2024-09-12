"use client";
import { Button } from "@/components/ui/button";
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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import {  useForm } from "react-hook-form";
import { z } from "zod";
const formSchema = z.object({
  title: z.string().min(1, { message: "Job Title Cannot be empty" }),
});
const CreateJob = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
    },
  });
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
  };

  const [isLoading, setIsLoading] = useState(false)

  return (
    <div className="max-w-5xl mx-auto flex md:items-center md:justify-center p-6 h-full">
      <div>
        <h1 className="text-2xl">Name Your Job</h1>
        <p className="text-sm text-neutral-500">
          What would you like to name your job? Don&apos;t worry you can change
          this later
        </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 mt-8">
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input 
                  disabled={isLoading}
                  placeholder="Full Stack Developer etch" 
                  {...field} />
                </FormControl>
                <FormDescription>
                  Role of this Job
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center">
            <Link href={'/'}>
            <Button type="button" variant={'ghost'}>Cancel</Button>
            </Link>
            <Button type="submit" disabled={isLoading}>Continue</Button>
          </div>
        </form>
      </Form>
      </div>
    </div>
  );
};

export default CreateJob;
