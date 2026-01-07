"use client"
import { getPosts } from "@/dexie/queries";
import { Card, CardHeader } from "./ui/card";
import { useEffect, useState } from "react";
import { AnalyzedPost } from "@/dexie/db";
import Link from "next/link";

export default function RecentAnalysis() {
    
        // const chatInfo = useLiveQuery(()=>getChatById(chatId as string),[chatId])

    const [allPosts,setAllPosts] = useState<AnalyzedPost[] | null>(null)

    useEffect(()=>{
        let mounted = true
        getPosts().then((posts) => {
            if(!mounted) return;
            setAllPosts(posts ?? null)
        }).catch((error) => {
            console.log(error)
            if(mounted) setAllPosts(null)
        })

        return () => {mounted = false} 
    },[])


  return (
    <div className=" w-full h-full p-10 bg-primary-foreground rounded-xl">
      <div className="pb-10">
        <p className="font-semibold text-md text-secondary-foreground text-lg">Recent Analyzed Posts:</p>
      </div>
      
      {allPosts && allPosts.length >= 1 ? allPosts.map((post:AnalyzedPost) => ( 
     <Link href={`/review/${post.id}`} key={post.id} >
      <Card  className="w-full bg-primary">
        <CardHeader className="flex-col items-center justify-center gap-2 max-w-lg">
            <p className="font-bold italic text-xs text-primary-foreground">{post.post}</p>
            <span className="text-muted">{post.createdAt.toDateString()}</span>
        </CardHeader>
      </Card>
     </Link>
    )): <div className="text-sm text-muted-foreground">No posts yet</div>}
    </div>
  )
}
