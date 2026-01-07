import Dexie, { type EntityTable } from 'dexie';

interface AnalyzedPost {
  id: string
  post:string
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
    createdAt: Date
    updatedAt: Date
}



const db = new Dexie('localDb') as Dexie & {
  analyzedPost: EntityTable<AnalyzedPost,'id'>,
};

// Schema declaration:
db.version(1).stores({
  analyzedPost: 'id, post, createdAt', 
});

export type { AnalyzedPost };
export { db };