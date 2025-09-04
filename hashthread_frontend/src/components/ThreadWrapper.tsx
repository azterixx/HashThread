"use client";

import { getThread } from "@/shared/api/Thread/api";
import { useQuery } from "@tanstack/react-query";
import { Thread } from "./Thread";
import { FeedSkeleton } from "./FeedSkeleton";
import { CreateThreadAndComment } from "./CreateThreadAndComment";
import { useToogleComments } from "@/shared/store/ToogleComments";
import { memo, useEffect } from "react";

interface ThreadWrapperProps {
  threadId?: string;
}

export const ThreadWrapper = memo(({ threadId }: ThreadWrapperProps) => {
  const { data, isLoading } = useQuery({
    queryKey: ["thread", threadId],
    queryFn: () => getThread(threadId),
  });

  const isActive = useToogleComments((state) => state.isActive);
  const setIsActive = useToogleComments((state) => state.setIsActive);

  useEffect(() => {
    setIsActive(true);
    return () => {
      setIsActive(false);
    };
  }, [setIsActive]);

  if (isLoading || !data) {
    return null;
  }

  return (
    <div>
      <Thread thread={data} border={false} type="threadPage" />
      {isActive && (
        <div className="border-b border-borderColor">
          <CreateThreadAndComment type="comment" threadId={threadId} />
        </div>
      )}
    </div>
  );
});
