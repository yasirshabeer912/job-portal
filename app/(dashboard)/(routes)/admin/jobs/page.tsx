import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { PlusIcon } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import Jobs from "./_components/Jobs";

const JobPageOverView = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const jobs = await db.job.findMany({
    where: {
      userId,
    },
    include: {
      category: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  // console.log(response);
  return (
    <div className="p-6 ">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button>
            <PlusIcon className="h-5 w-5 mr-4" />
            New Job
          </Button>
        </Link>
        
      </div>
      <Jobs jobs={jobs} />
    </div>
  );
};

export default JobPageOverView;
