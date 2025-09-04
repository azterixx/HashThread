import { toggleLikeComment } from "@/shared/api/Comments/api";
import { CommentType } from "@/shared/api/types/types";
import { useSwitcher } from "@/shared/store/Switcher";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

export const useToggleLikeComment = (commentId: string, threadId: string) => {
  const queryClient = useQueryClient();
  const sortType = useSwitcher((state) => state.sort);
  return useMutation({
    mutationFn: () => toggleLikeComment(commentId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["comments", threadId, sortType],
      });

      const previousData = queryClient.getQueryData<InfiniteData<CommentType>>([
        "comments",
        threadId,
        sortType,
      ]);

      queryClient.setQueryData<InfiniteData<CommentType>>(
        ["comments", threadId, sortType],
        (oldData) => {
          if (!oldData) return oldData;

          return {
            ...oldData,
            pages: oldData.pages.map((page) => ({
              ...page,
              items: page.items.map((comment) =>
                comment.id === commentId
                  ? {
                      ...comment,
                      isLiked: !comment.isLiked,
                      likeCount: comment.isLiked
                        ? comment.likeCount - 1
                        : comment.likeCount + 1,
                    }
                  : comment,
              ),
            })),
          };
        },
      );

      return { previousData };
    },
    onError: (err, vars, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(
          ["comments", threadId, sortType],
          context.previousData,
        );
      }
    },
  });
};
