import { db } from "./db";

// create a post, update a post with analyzed data, delete a post, get all the posts

type UpdatePostType = {
    spelling:string[]
    grammar:string[]
    clarity:string[]
    tone:string[]
    structure:string[]
    emoji:string[]
    feedback:string[]
    improvements:string
    clarityScore:number
    structureScore:number
    enagementScore:number
    viralityScore:number
    rewrittenPost:string
}

const createPost = async (post:string)=>{
    const userInput = {
        id:crypto.randomUUID(),
        post,
        issues:{
            spelling:[],
            grammar:[],
            clarity:[],
            tone:[],
            structure:[],
            emoji:[],
        },
        engagement_feedback:[],
        suggested_improvements:[],
        scores:{
            clarity:0,
            structure:0,
            engagement:0,
            virality:0,
        },
        rewritten_post:"",
        platform:"X",    
        createdAt:new Date(),
        updatedAt:new Date()
    }

    await db.analyzedPost.add(userInput)
    return userInput
}

const getPosts = async()=>{
 return  await db.analyzedPost.toArray()
}

const getPost = async(id:string)=>{
    if (!id) return
    return await db.analyzedPost.get(id)
}

const updatePost = async (id:string,updateValues:UpdatePostType )=>{
    if(!id) return

    return await db.analyzedPost.update(id,{issues:{spelling:updateValues.spelling,grammar:updateValues.grammar,clarity:updateValues.clarity,tone:updateValues.tone,structure:updateValues.structure,emoji:updateValues.emoji},engagement_feedback:updateValues.feedback,rewritten_post:updateValues.rewrittenPost,scores:{virality:updateValues.viralityScore,clarity:updateValues.clarityScore,structure:updateValues.structureScore,engagement:updateValues.enagementScore}})
}

const deletePost = async(id:string)=>{
    if(!id) return;

    const postId = await db.analyzedPost.get(id)

    if(!postId){
        throw new Error(`post with id: ${id} not found`)
    }

    return db.analyzedPost.delete(id)
}

export {deletePost,updatePost,createPost,getPost,getPosts}