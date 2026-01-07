import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPostAnalysis() {
  return (
    <div className="w-full h-full p-6 space-y-4">
      
      {/* scores */}
      <Skeleton className="h-5 w-48 mb-4"/>
      <div className="space-y-3 ">
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
      </div>

        {/* issues */}
        <Skeleton className="h-5 w-48 mb-4"/>
      <div className="space-y-3">
         <Skeleton className="h-3" />
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
        <Skeleton className="h-3" />
         <Skeleton className="h-3" />
        <Skeleton className="h-3" />
      </div>

      {/* feeback */}
      <Skeleton className="h-5 w-48 mb-4"/>
      <div className="space-y-2">
      <Skeleton className="h-3" />
      <Skeleton className="h-3" /> 
      </div>

      {/* improvement */}
     <Skeleton className="h-5 w-48 mb-4"/>

      {/* Rewritten post */}
      <Skeleton className="h-5 w-48 mb-4"/>

    {/* footer / platform*/}
      <div>
      <Skeleton className="h-5 w-48 mb-4"/>
      </div>

    </div>
  );
}
