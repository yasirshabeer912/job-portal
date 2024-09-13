"use client"
import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import { useState } from "react";

interface JobPublishActionProps {
  disabled: boolean;
  jobId: string;
  isPublished: boolean;
}

const JobPublishAction = ({
  disabled,
  jobId,
  isPublished,
}: JobPublishActionProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = () => {};

  return (
    <div className="flex items-center gap-x-3">
      <Button
        variant="outline"
        onClick={onClick}
        disabled={disabled || isLoading}
        size="sm"
      >
        {isPublished ? "Unpublish" : "Publish"}
      </Button>
      <Button 
        variant="destructive" 
        size="icon" 
        disabled ={isLoading}
        
        >
          <Trash className="w-4 h-4"/>
        </Button>
    </div>
  );
};

export default JobPublishAction