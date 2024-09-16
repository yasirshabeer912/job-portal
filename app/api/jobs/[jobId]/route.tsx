import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
    req: Request,
    { params }: { params: { jobId: string } }
) => {
    try {
        const { userId } = auth();
        const updatedValues = await req.json();
        const { jobId } = params;
        if (!userId) {
            return new NextResponse("Un-Authorized", { status: 401 });
        }
        if (!jobId) {
            return new NextResponse("iD is Missing", { status: 401 });
        }

        const job = await db.job.update({
            where: {
                id: jobId,
                userId,
            },
            data: {
                ...updatedValues,
            },
        });

        return NextResponse.json(job);
    } catch (error) {
        console.log(`[JOB POST ]: ${error}`);
        return new NextResponse("Internal Server Error ", { status: 500 });
    }
};
