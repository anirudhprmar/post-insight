export type ResponseType = {
    issues:{
        spelling:string[],
        grammar:string[],
        clarity:string[],
        tone:string[],
        structure:string[],
        emoji:string[],
    },
    engagement_feedback:string[],
    suggested_improvements:string[],
    scores:{
        clarity:number,
        structure:number,
        engagement:number,
        virality:number,
    },
    rewritten_post:string,
    platform:string,
    
}