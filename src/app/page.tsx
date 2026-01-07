import PostInput from "@/components/PostInput";
import RecentAnalysis from "@/components/RecentAnalysis";
import { Card } from "@/components/ui/card";

export default async function Page() {
  return (
    <main className="min-h-screen py-5 bg-foreground ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center py-3">
          <h1 className="text-2xl md:text-3xl font-bold text-white ">
            📈 Post Insight
          </h1>
        </div>
        <Card className="flex-col bg-foreground max-w-3xl mx-auto gap-8 mt-10 ">
          <PostInput />
          <RecentAnalysis />
        </Card>
      </div>
    </main>
  );
}
