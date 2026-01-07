import { z } from "zod";
import { NextRequest, NextResponse } from "next/server";
import { Client } from "@gradio/client";
import { ResponseType } from "@/types/response-type"



const inputPost = z.object({
    post: z.string().min(1, "Text cannot be empty"),
})




export async function POST(request: NextRequest) {
    
 try {
        const body = await request.json()
       const { post } = inputPost.parse(body);

       console.log("Analyzing post:", post)
        
       const client = await Client.connect("anirudhprmar/x-posts")
       const result = await client.predict("/analyze_post",{
        post
       })
       console.log("Received result from Gradio client:", result.data)
       const res = result.data as ResponseType[]
       const parsedResponse = typeof res[0] === 'string' ? JSON.parse(res[0]) : res[0];

        console.log("Analysis completed:", parsedResponse)

       return NextResponse.json(parsedResponse,{
        status:200,
        headers:{
            "Content-Type":"application/json"
        }
       })
 } catch (error) {
    return NextResponse.json({
        success:false,
        error: error instanceof Error ? error.message : "An unknown error occurred"
    },{
        status:400
    })
 }
}