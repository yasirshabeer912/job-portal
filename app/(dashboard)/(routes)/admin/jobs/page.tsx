import { Button } from "@/components/ui/button";
import { PlusIcon } from "lucide-react";
import Link from "next/link";

const JobPageOverView = async () => {
  return (
    <div className="p-6 ">
      <div className="flex items-end justify-end">
        <Link href={"/admin/create"}>
          <Button>
            <PlusIcon className="h-5 w-5 mr-4"/>
            New Job
            </Button>
        </Link>
      </div>
    </div>
  );
};

export default JobPageOverView;
