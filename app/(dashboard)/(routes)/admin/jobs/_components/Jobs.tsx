import Link from "next/link";

interface JobsProps {
    jobs: Array<{ id: string , title:string }>; 
  }
  
  const Jobs = ({ jobs }: JobsProps) => {
    return (
      <>
        {jobs.map((job) => (
         <div>
             <Link  key={job.id} href={`/admin/jobs/${job.id}`}>{job.title} </Link >
         </div>
        ))}
        
      </>
    );
  };
  
  export default Jobs;
  