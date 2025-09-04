import { SortType } from "@/shared/store/Switcher";
import { baseInstance } from "../base";
import { CommentType, PostCommentResponse } from "../types/types";

export const postComment = async (
  threadId: string,
  text: string,
  replyTo?: number,
) =>
  (
    await baseInstance.post<PostCommentResponse>("/comment", {
      threadId,
      text,
      replyTo,
    })
  ).data;

export const getComments = async (
  threadId: string,
  page: number,
  sort: SortType = "popular",
) =>
  (
    await baseInstance.get<CommentType>(`/comment/${threadId}`, {
      params: {
        page,
        sort,
      },
    })
  ).data;

export const toggleLikeComment = async (commentId: string) =>
  (
    await baseInstance.patch<{ likeCount: number; isLiked: boolean }>(
      `/comment/${commentId}/like`,
    )
  ).data;
