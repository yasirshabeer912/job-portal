import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import JobPublishAction from "./_components/JobPublishAction";
import { Banner } from "@/components/Banner";
import SectionHeading from "./_components/SectionTitle";
import JobTitle from "./_components/JobTitle";
import CategoryForm from "./_components/CategoryForm";
import ImageForm from "./_components/ImageForm";
import ShortDescription from "./_components/ShortDescription";
import HourlyRateForm from "./_components/HourlyRateForm";
import ShiftTimingForm from "./_components/ShiftTimingMode";
import WorkTimingMode from "./_components/WorkTimingMode";
import JobWorkExperience from "./_components/JobWorkExperience";
import JobDescription from "./_components/JobDescription";

const JobDetailsPage = async ({ params }: { params: { jobId: string } }) => {
  // verify the mongoID
  const validObjectRegex = /^[a-f\d]{24}$/i;
  if (!validObjectRegex.test(params.jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = auth();
  if (!userId) {
    return redirect("/");
  }

  const job = await db.job.findUnique({
    where: {
      id: params.jobId,
      userId,
    },
  });

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

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

      {!job.isPublished && (
        <div>
          <Banner
            variant={"warning"}
            label={
              "This Job is Un Published It will not be visibled in Job List"
            }
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        <div className="left">
          {/* section title */}
          <SectionHeading
            icon={<LayoutDashboard />}
            label={"Customize You Job"}
          />

          <JobTitle initialData={job} jobId={params.jobId} />

          <CategoryForm
            initialData={job}
            jobId={params.jobId}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          {/* cover image */}

          <ImageForm initialData={job} jobId={params.jobId} />
          <ShortDescription
            initialData={job}
            jobId={params.jobId}
          />
          <ShiftTimingForm
            initialData={job}
            jobId={params.jobId}
          />
          <WorkTimingMode
            initialData={job}
            jobId={params.jobId}
          />
          <HourlyRateForm
            initialData={job}
            jobId={params.jobId}
          />
          <JobWorkExperience
            initialData={job}
            jobId={params.jobId}
          />
        </div>
        <div className="right"></div>

        <div className="col-span-2">
          <JobDescription initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
