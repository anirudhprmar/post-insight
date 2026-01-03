import { z } from "zod";
import {createMistral,type MistralLanguageModelOptions} from '@ai-sdk/mistral';

import {generateText} from 'ai';
import { NextRequest, NextResponse } from "next/server";




const inputText = z.object({
    text: z.string().min(1, "Text cannot be empty"),
})


const mistral = createMistral({
    apiKey:process.env.MISTRAL_API_KEY || "",
})

const model = mistral("mistral-large-latest")

export async function POST(request: NextRequest) {
    
 try {
        const body = await request.json()
       const { text } = inputText.parse(body);

       console.log("Analyzing post:", text)
   
       const response = await generateText({
        model,
        prompt:text,
        system:`you are an expert Twitter copywriter who grew 10k+ tech accounts to 20%+ engagement. Analyze the provided post for its hook, structure, clarity, optimized for user engagement. Direct fixes only (no fluff), X limits (280 chars, hooks first), use emojis only when needed. Do not invent facts, mention model limitations, give generic advice, if no issues are found, state that the post is well-written. Your response must be exactly::
        {
            "issues": {
                "spelling": [],
                "grammar": [],
                "clarity": [],
                "tone": [],
                "structure": [],
                "emoji": []
            },
            "engagement_feedback": [],
            "suggested_improvements": [],
            "scores": {
                "clarity": 0,
                "structure": 0,
                "engagement": 0,
                "virality":0
            },
            "rewritten_post": "",
            "platform": "X"
        }

        Scoring:
        - Scores must be integers from 1 to 10.
        - Base scores only on the provided text.

        Tone:
        - direct, friendly, real.
        - emojis only when needed.

        Reply with only a plain JavaScript object, nothing else, and do NOT use markdown or backticks.
        Absolutely do not include any triple backticks or specify 'json' or any other language.

        Do not add, remove, or rename fields.
        If a field is not applicable, return an empty array or empty string.


         `,
        providerOptions:{
           mistral:{
               safePrompt: true, 
               parallelToolCalls: false,
           } satisfies MistralLanguageModelOptions
        }
       })
       
        const parsedResponse = JSON.parse(response.text)

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