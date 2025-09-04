import { CommentItems, CommentType } from "@/shared/api/types/types";
import { UserIcon } from "./UserIcon";
import React from "react";
import { LikeButton } from "./LikeButton";
import { useToggleLikeComment } from "@/shared/lib/hooks/useToggleLikeComment";

interface ReplyItemProps {
  reply: CommentItems;
  threadId: string;
}

export const ReplyItem = ({ reply, threadId }: ReplyItemProps) => {
  const { mutate: toggleLikeReply, isPending } = useToggleLikeComment(
    reply.id,
    threadId,
  );

  return (
    <div className="flex gap-3 p-4" key={reply.id}>
      <UserIcon size="md" />
      <div className="flex w-full flex-col gap-3">
        <p className="font-medium text-white">
          Anonym{" "}
          {reply.isOp && (
            <span className="font-medium leading-m text-primaryGreen">OP</span>
          )}
        </p>

        <p className="custom-wrap-class font-inter text-m font-m leading-m text-textWhite">
          {reply.text}
        </p>
        <div className="flex gap-1">
          <LikeButton
            likeCount={reply.likeCount}
            onToggleLike={() => toggleLikeReply()}
            disabled={isPending}
            isLiked={reply.isLiked}
          />
        </div>
      </div>
    </div>
  );
};
