import { CreateThreadAndComment } from "@/components/CreateThreadAndComment";
import { Feed } from "@/components/Feed";

export default function Home() {
  return (
    <main className="border- mx-auto mt-3 w-full overflow-y-auto rounded-t-lg bg-bgDark md:w-1/2">
      <div className="border-b border-borderColor">
        <CreateThreadAndComment type="thread" />
      </div>
      <Feed />
    </main>
  );
}
