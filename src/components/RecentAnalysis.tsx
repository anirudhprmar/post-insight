"use client"
import { deletePost, getPosts } from "@/dexie/queries";
import { Card, CardContent, CardHeader } from "./ui/card";
import { useEffect, useState } from "react";
import { AnalyzedPost } from "@/dexie/db";
import Link from "next/link";
import { Button } from "./ui/button";
import { Trash } from "lucide-react";
import { toast } from "sonner"


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

    const handleDelete = async(id:string) =>{
      await deletePost(id).then( () =>
        toast("Post Deleted")
    ).catch((error) => console.log(error))
    }

  return (
    <div className=" w-full h-full p-10 bg-primary-foreground rounded-xl">
      <div className="pb-10">
        <p className="font-semibold text-md text-secondary-foreground text-lg">Recent Analyzed Posts:</p>
      </div>
      
      {allPosts && allPosts.length >= 1 ? allPosts.map((post:AnalyzedPost) => ( 
        <>
      <Card key={post.id} className="w-full bg-primary mb-4">
     <Link href={`/review/${post.id}`}  >
        <CardHeader className="flex-col items-center justify-start gap-2 max-w-lg ">
            <p className="font-bold italic text-xs text-primary-foreground text-left">{post.post}</p>
            <span className="text-muted">{post.createdAt.toDateString()}</span>
        </CardHeader>
     </Link>
     <CardContent className="text-right">
      <Button variant={'destructive'} onClick={() => handleDelete(post.id)} size={'sm'} className="bg-secondary flex-1 hover:bg-primary-foreground"><Trash/></Button>
     </CardContent>
      </Card>
        </>
    )): <div className="text-sm text-muted-foreground">No posts yet</div>}
    </div>
  )
}
