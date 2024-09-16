import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req :Request) => {
    try {
        const {userId} = auth()
        const {title} = await req.json()
        console.log(title)
        if(!userId){
            return new NextResponse("Un-Authorized" , {status:401})
        }
        if(!title){
            return new NextResponse("Title is Missing" , {status:422})
        }

        const job = await db.job.create({
            data : {
                userId,
                title
            }
        })

        return NextResponse.json(job)
        
    } catch (error) {
        console.log(`[JOB POST ]: ${error}`)
        return new NextResponse("Internal Server Error ", {status:500})
    }
}

export const GET = async (req:Request) =>{
    const {userId} = auth();
    if(!userId){
        return new NextResponse("Un-Authorized" , {status:401})
    }
    const jobs = await db.job.findMany()
    return NextResponse.json(jobs)

}