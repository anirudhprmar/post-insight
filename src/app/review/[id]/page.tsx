"use client"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { AnalyzedPost } from "@/dexie/db"
import { getPost } from "@/dexie/queries"
import Link from "next/link"
import { useParams } from "next/navigation"
import { useEffect, useState } from "react"

export default function Review() {
    const params = useParams()
    const id = params?.id as string
    const [post,setPost] = useState<AnalyzedPost | null>(null)

    useEffect(()=>{
        if(!id){
            return
        }
        const fetchPost = async () => {
            const value = await getPost(id)
            setPost(value ??  null)
        }

        fetchPost()
    },[id])

  return (
    <div className="bg-secondary-foreground min-h-screen p-10 ">

     <p className="text-primary-foreground cursor-pointer">
    <Link href={"/"}>
        back
    </Link>
    </p>
        <div className="mx-auto max-w-2xl">
            <div className="text-primary-foreground">
                <span className="font-bold ">Post:</span>
            <h1 className=" text-left pb-5">{'"'}{post?.post}{'"'}</h1>
            </div>
        <p className="text-primary-foreground text-left font-bold pb-5">Post Analysis: </p>
        {post && (<Card>
        
        <CardContent>
            <div>
            <p className="font-bold text-lg">Scores:</p>
            {post.scores && Object.entries(post.scores).map(([key, value]) => (
                <div key={key}>
                <strong>{key}:</strong> {value} <span>/ 10</span>
                </div>
            ))}
            </div>
            <div>
            <p className="font-bold text-lg">Issues:</p>
            {post.issues && Object.entries(post.issues).map(([key, value]) => (
                <div key={key}>
                <strong>{key}:</strong> {value.length > 0 ? value.join(", ") : "None"}
                </div>
            ))}
            </div>
            <div>
            <p className="font-bold text-lg">Engagement Feedback:</p>
            {post.engagement_feedback.length > 0 ? (
                <ul>
                {post.engagement_feedback.map((feedback, index) => (
                    <li key={index}>{feedback}</li>
                ))}
                </ul>
            ) : (
                <p>None</p>
            )}
            </div>
            <div>
            <p className="font-bold text-lg">Suggested Improvements:</p>
            {post.suggested_improvements.length > 0 ? (
                <ul>
                {post.suggested_improvements.map((improvement, index) => (
                    <li key={index}>{improvement}</li>
                ))}
                </ul>
            ) : (
                <p>None</p>
            )}
            </div>
            <div>
            <p className="font-bold text-lg">Rewritten Post:</p>
            {post.rewritten_post !== "" ? <p className="p-3 bg-secondary rounded-md">{post.rewritten_post}</p>: "none"}
            </div>
        </CardContent>

        <CardFooter>
            <p className="flex items-center justify-center gap-2">Platform: {post.platform === "X" ? <svg className="size-3" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg> : null}</p>
        </CardFooter>
        </Card>)}
        </div>
    </div>
  )
}
