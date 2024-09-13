import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import  JobPublishAction  from "./_components/JobPublishAction";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {

  // verify the mongoID
  const validObjectRegex = /^[a-f\d]{24}$/i;
  if(!validObjectRegex.test(params.jobId)){
    return redirect('/admin/jobs')
  }
  
  const {userId} = auth()
  if(!userId){
    return redirect('/')

  }

  const job = await db.job.findUnique({
    where : {
      id :params.jobId,
      userId
    }
  })

  if(!job){
    return redirect('/admin/jobs')
  }

const requiredFields = [job.title, job.description, job.imageUrl];
const totalFields = requiredFields.length;
const completedFields = requiredFields.filter(Boolean).length;
const completionText = `(${completedFields}/${totalFields})`;
const isComplete = requiredFields.every(Boolean);
return (
  <div className="p-6">
    <Link href="/admin/jobs">
      <div className="flex items-center gap-3 text-sm text-neutral-500">
        <ArrowLeft className="w-4 h-4" />
        Back
      </div>
    </Link>
    {/* title */}
    <div className="flex items-center justify-between my-4">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-2xl font-medium">Job Setup</h1>
        <span className="text-sm text-neutral-500">
          Complete All Fields ({completionText})
        </span>
      </div>
      {/* action button */}
      <JobPublishAction 
      isPublished={job.isPublished}
      jobId={params.jobId}
      disabled={!isComplete}
      />
    </div>
  </div>
);

};

export default JobDetailsPage;
