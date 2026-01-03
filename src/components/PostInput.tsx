"use client"

import { ArrowUpIcon } from "lucide-react"
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from "zod"
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupTextarea } from "./ui/input-group";
import { useState } from "react"
import { Field, FieldError, FieldGroup } from "./ui/field"

const schema = z.object({ text: z.string().min(1,"Can't be just one word") })

export default function PostInput() {
  
  const [analyzedData,setAnalyzedData] = useState(null)
  
  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      text: ""
    }
  })

  async function onSubmit(data:z.infer<typeof schema>) {
  try {
      console.log("Submitting post:", data)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers:{
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({text:data.text})
      })
      const result = await response.json()
      setAnalyzedData(result)
  } catch (error) {
    console.log("Error submitting post:", error)
  }
  }

  return (
    <div className="w-1/2 mx-auto py-10">

      <form id="post-form" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>

              <Controller
                name="text"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    
                    <InputGroup>
                    <InputGroupTextarea placeholder="Paste your post idea here." {...field} aria-invalid={fieldState.invalid}/>
                    <InputGroupAddon align="block-end">
                
                    <InputGroupButton
                      variant="default"
                      className="rounded-xl ml-auto"
                      size="sm"
                      type="submit" 
                      form="post-form"
                    >
                      <ArrowUpIcon />
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

      {analyzedData && (
        <div className="mt-10 p-5 border rounded-lg bg-gray-50">
          <h2 className="font-bold mb-3">Analysis Result:</h2>
          <pre className="whitespace-pre-wrap">{JSON.stringify(analyzedData)}</pre>
        </div>
      )}
      
    </div>
  )
}
