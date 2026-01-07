"use client"

import { ArrowUpIcon, LoaderIcon } from "lucide-react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "./ui/input-group";
import { useState, useTransition } from "react"
import { Field, FieldError, FieldGroup } from "./ui/field"
import { ResponseType } from "@/types/response-type"
import { Card, CardContent, CardFooter } from "./ui/card"
import { createPost, updatePost } from "@/dexie/queries"
import { SkeletonPostAnalysis } from "./SkeletonAnalysis"

const schema = z.object({ text: z.string().min(1,"Can't be just one word") })

export default function PostInput() {
  
  const [analyzedData,setAnalyzedData] = useState<ResponseType | null>(null)

  const [isPending, startTransition] = useTransition();  

  
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: ""
    }
  })


  async function onSubmit(data:z.infer<typeof schema>) {
    startTransition( async()=>{
    try {
        console.log("Submitting post:", data)
        const postInfo = await createPost(data.text)
        const response = await fetch('/api/analyze', {
          method: 'POST',
          headers:{
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({text:data.text.trim()})
        })
        const result = await response.json()
        console.log("Analysis result:", result)
        // use `result` (not the state variable) and normalize optional arrays/fields
      const issues = result.issues ?? { spelling: [], grammar: [], clarity: [], tone: [], structure: [], emoji: [] }
      const scores = result.scores ?? { clarity: 0, structure: 0, engagement: 0, virality: 0 }
      const improvements = result.suggested_improvements ?? []

      await updatePost(postInfo.id, {
        spelling: issues.spelling ?? [],
        grammar: issues.grammar ?? [],
        clarity: issues.clarity ?? [],
        tone: issues.tone ?? [],
        structure: issues.structure ?? [],
        rewrittenPost: result.rewritten_post ?? "",
        structureScore: scores.structure ?? 0,
        viralityScore: scores.virality ?? 0,
        clarityScore: scores.clarity ?? 0,
        enagementScore: scores.engagement ?? 0,
        feedback: result.engagement_feedback ?? [],
        emoji: issues.emoji ?? [],
        improvements
      })
        setAnalyzedData(result)
    } catch (error) {
      console.log("Error submitting post:", error)
    }
   })
  }

  return (
    <div className="py-10 w-full h-full bg-secondary-foreground rounded-xl p-10 ">

      <form id="post-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>

              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    
                    <InputGroup>
                    <InputGroupTextarea className="text-white" placeholder="Paste your post idea here." {...field} aria-invalid={fieldState.invalid}/>
                    <InputGroupAddon align="block-end">
                
                    <InputGroupButton
                    disabled={isPending}
                      variant="default"
                      className={isPending ? "animate-pulse opacity-50 ml-auto" : "rounded-xl ml-auto"}
                      size="sm"
                      type="submit" 
                      form="post-form"
                    >
                      {isPending ? <LoaderIcon className="animate-spin" /> : <ArrowUpIcon />}
                    </InputGroupButton>
                </InputGroupAddon>
              </InputGroup>  
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

            </FieldGroup>
      </form>

        {isPending ? (
          <SkeletonPostAnalysis/>
        ): analyzedData ? 
        <div className="mt-10 p-5 border rounded-lg bg-gray-50">
          <h2 className="font-bold mb-3">Analysed Result:</h2>
          
         {analyzedData && (<Card>
          
            <CardContent>
              <div>
                <p className="font-bold text-lg">Scores:</p>
                {analyzedData.scores && Object.entries(analyzedData.scores).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value} <span>/ 10</span>
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-lg">Issues:</p>
                {analyzedData.issues && Object.entries(analyzedData.issues).map(([key, value]) => (
                  <div key={key}>
                    <strong>{key}:</strong> {value.length > 0 ? value.join(", ") : "None"}
                  </div>
                ))}
              </div>
              <div>
                <p className="font-bold text-lg">Engagement Feedback:</p>
                {analyzedData.engagement_feedback.length > 0 ? (
                  <ul>
                    {analyzedData.engagement_feedback.map((feedback, index) => (
                      <li key={index}>{feedback}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None</p>
                )}
              </div>
              <div>
                <p className="font-bold text-lg">Suggested Improvements:</p>
                {analyzedData.suggested_improvements.length > 0 ? (
                  <ul>
                    {analyzedData.suggested_improvements.map((improvement, index) => (
                      <li key={index}>{improvement}</li>
                    ))}
                  </ul>
                ) : (
                  <p>None</p>
                )}
              </div>
              <div>
                <p className="font-bold text-lg">Rewritten Post:</p>
                <p className="p-3 bg-secondary rounded-md">{analyzedData.rewritten_post}</p>
              </div>
            </CardContent>

            <CardFooter>
              <p className="flex items-center justify-center gap-2">Platform: {analyzedData.platform === "X" ? <svg className="size-3" role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><title>X</title><path d="M14.234 10.162 22.977 0h-2.072l-7.591 8.824L7.251 0H.258l9.168 13.343L.258 24H2.33l8.016-9.318L16.749 24h6.993zm-2.837 3.299-.929-1.329L3.076 1.56h3.182l5.965 8.532.929 1.329 7.754 11.09h-3.182z"/></svg> : null}</p>
            </CardFooter>
          </Card>)}
        </div>: (<div className="mt-10 p-5 border rounded-lg bg-gray-50">
          <h2 className="font-bold mb-3 text-muted-foreground">Paste a post above to analyze</h2>
        </div>)
      }
      </div>
    )
}
