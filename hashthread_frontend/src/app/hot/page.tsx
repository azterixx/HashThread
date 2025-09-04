import { Feed } from "@/components/Feed";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Hot",
};

export default function LikedThreads() {
  return (
    <main className="mx-auto mt-3 w-full overflow-y-auto rounded-lg bg-bgDark md:w-1/2">
      <Feed sort="hot" />
    </main>
  );
}
