import { Feed } from "@/components/Feed";
import { Switcher } from "@/components/Switcher";
import { ThreadWrapper } from "@/components/ThreadWrapper";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comments",
};

export default async function CommentsPage({
  params,
}: {
  params: Promise<{ threadId: string }>;
}) {
  const { threadId } = await params;

  return (
    <div className="mt-3 flex flex-col items-center gap-4">
      <div className="w-full rounded-lg bg-bgDark md:w-1/2">
        <ThreadWrapper threadId={threadId} />
      </div>

      <div className="flex w-full flex-col gap-3 overflow-y-auto rounded-lg bg-bgDark md:w-1/2">
        <div className="flex items-center justify-between px-3">
          <h3 className="py-4 text-xl text-white">Comments</h3>
          <Switcher />
        </div>

        <Feed type="comments" threadId={threadId} />
      </div>
    </div>
  );
}
