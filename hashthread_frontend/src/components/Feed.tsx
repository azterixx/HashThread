"use client";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { fetchFeed } from "@/shared/api/Feed/api";
import {
  CommentItems,
  CommentType,
  ThreadItems,
  ThreadType,
} from "@/shared/api/types/types";
import { Thread } from "./Thread";
import { FeedSkeleton } from "./FeedSkeleton";
import { getComments } from "@/shared/api/Comments/api";
import { Comments } from "./Comment";
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";
import { fetchLikedThreads } from "@/shared/api/LikedThreads/api";
import { useSwitcher } from "@/shared/store/Switcher";
import { useToogleComments } from "@/shared/store/ToogleComments";
import { comment } from "postcss";
import { Bounce, ToastContainer } from "react-toastify";

type FeedProps = {
  type?: "threads" | "comments" | "likedThreads";
  threadId?: string;
  sort?: string;
};

export const Feed = ({ type = "threads", threadId, sort }: FeedProps) => {
  const { ref, inView, entry } = useInView();
  const sortType = useSwitcher((state) => state.sort);
  const {
    data,
    error,
    isLoading,
    fetchNextPage,
    isFetchingNextPage,
    hasNextPage,
  } = useInfiniteQuery<ThreadType | CommentType>({
    queryKey:
      type === "threads" ? ["threads"] : ["comments", threadId, sortType],
    queryFn: ({ pageParam }) =>
      type === "threads"
        ? fetchFeed(Number(pageParam), sort)
        : getComments(threadId ?? "", Number(pageParam), sortType),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      if (Number(lastPage.meta.currentPage) < lastPage.meta.totalPages) {
        return Number(lastPage.meta.currentPage) + 1;
      } else {
        return undefined;
      }
    },
    enabled: type !== "likedThreads",
    refetchInterval: 15_000,
    refetchOnWindowFocus: false,
  });

  const {
    data: likedData,
    isLoading: isLikedLoading,
    error: likedError,
  } = useQuery({
    queryKey: ["likedThreads"],
    queryFn: fetchLikedThreads,
    enabled: type === "likedThreads",
    refetchInterval: 15_000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    if (entry && inView && type !== "likedThreads") {
      fetchNextPage();
    }
  }, [entry, inView, type]);

  if (isLoading || isLikedLoading) {
    return <FeedSkeleton />;
  }

  if (type === "likedThreads") {
    if (!likedData || likedData.length === 0) {
      return (
        <div className="flex justify-center p-5 text-[40px] text-textWhite">
          No liked threads found
        </div>
      );
    }
    return (
      <div>
        {likedData.map((item) => (
          <Thread thread={item} key={item.id} href={`/${item._id}`} />
        ))}
      </div>
    );
  }

  if (!data?.pages.some((page) => page.items.length > 0)) {
    return (
      <div className="flex justify-center p-5 text-[40px] text-textWhite">
        There's nothing here yet
      </div>
    );
  }

  return (
    <div>
      {data?.pages.map((page) => {
        return type === "threads"
          ? (page.items as ThreadItems[]).map((item) => (
              <Thread thread={item} key={item.id} href={`/${item.id}`} />
            ))
          : (page.items as CommentItems[])
              .filter((comment) => comment.replyTo === null)
              .map((comment) => (
                <Comments
                  key={comment.id}
                  comment={comment}
                  threadId={threadId!}
                  replies={(page.items as CommentItems[]).filter(
                    (item) => item.replyTo === comment.messageNumber,
                  )}
                />
              ));
      })}
      {isFetchingNextPage ? <FeedSkeleton /> : hasNextPage && <div ref={ref} />}
    </div>
  );
};
