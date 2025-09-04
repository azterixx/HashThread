import { Button } from "./ui";
import ShareIcon from "../icons/ShareIcon";
import { CommentItems, CommentType } from "@/shared/api/types/types";
import { useToggleLikeComment } from "@/shared/lib/hooks/useToggleLikeComment";
import { memo, useCallback, useState } from "react";
import { UserIcon } from "./UserIcon";
import { LikeButton } from "./LikeButton";
import { CommentButton } from "./CommentButton";
import { CreateThreadAndComment } from "./CreateThreadAndComment";
import { ReplyItem } from "./ReplyItem";
import { useQuery } from "@tanstack/react-query";
import { getThread } from "@/shared/api/Thread/api";

type CommentProps = {
  comment: CommentItems;
  threadId: string;
  replies?: CommentItems[];
};

export const Comments = memo(({ comment, threadId, replies }: CommentProps) => {
  const [isCommentOpen, setIsCommentOpen] = useState(false);

  const { mutate: toggleLikeComment, isPending } = useToggleLikeComment(
    comment.id,
    threadId,
  );

  return (
    <>
      <div className="min-h-[96px] animate-fadeIn border-b-2 border-borderColor">
        <div className="flex gap-3 p-4">
          <UserIcon size="lg" />
          <div className="flex w-full flex-col gap-3">
            <span className="font-medium text-white">
              Anonym{" "}
              {comment.isOp && (
                <span className="font-medium leading-m text-primaryGreen">
                  OP
                </span>
              )}
            </span>

            <p className="custom-wrap-class font-inter text-m font-m leading-m text-textWhite">
              {comment.text}
            </p>

            <div className="flex gap-1">
              <LikeButton
                onToggleLike={() => toggleLikeComment()}
                disabled={isPending}
                isLiked={comment.isLiked}
                likeCount={comment.likeCount}
              />
              <CommentButton
                count={replies?.length || 0}
                isActive={isCommentOpen}
                onClick={() => setIsCommentOpen(!isCommentOpen)}
              />
            </div>
          </div>
        </div>
      </div>

      {isCommentOpen && (
        <>
          <div className="border-b-2 border-borderColor">
            <div className="border-b-2 border-borderColor pl-14">
              <CreateThreadAndComment
                threadId={threadId}
                type="comment"
                onCancel={() => setIsCommentOpen(false)}
                repliesTo={comment.messageNumber}
              />
            </div>

            <div>
              {replies?.map((item) => (
                <div
                  key={item.id}
                  className="border-b-2 border-borderColor pl-14"
                >
                  <ReplyItem reply={item} threadId={threadId} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
});
