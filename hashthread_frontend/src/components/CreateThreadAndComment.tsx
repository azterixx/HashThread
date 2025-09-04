"use client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { postThread } from "@/shared/api/Thread/api";
import { Button, Textarea } from "./ui";
import { cn } from "@/shared/lib/utils";
import { useAutoResizeTextarea } from "@/shared/lib/hooks/useAutoResizeTextarea";
import { postComment } from "@/shared/api/Comments/api";
import { UserIcon } from "./UserIcon";
import SharePhotoIcon from "@/icons/SharePhotoIcon";
import { memo, useRef, useState } from "react";
import { ImagePreview } from "./ImagePreview";
import { CircularTextLimit } from "./CircularTextLimit";

type CreateProps = {
  type?: "thread" | "comment";
  threadId?: string;
  repliesTo?: number;
  onCancel?: () => void;
};

export const CreateThreadAndComment = memo(
  ({ type, threadId, repliesTo, onCancel }: CreateProps) => {
    const queryClient = useQueryClient();
    const { textAreaRef, text, setText, handleChange } =
      useAutoResizeTextarea();
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [imageFile, setImageFile] = useState<File[] | undefined>(undefined);

    // УЛУЧШИТЬ КОД В БУДУЩЕМ
    // для тредов
    const { mutate: threadMutate, isPending: isPendintThread } = useMutation({
      mutationFn: () => postThread(text, imageFile),
      onSuccess: () => {
        setText("");
        setImageFile([]);
        textAreaRef.current!.style.height = "auto";
        queryClient.invalidateQueries({ queryKey: ["threads"] });
      },
    });
    // для комментариев
    const { mutate: commentMutate, isPending: isPendintComment } = useMutation({
      mutationFn: () => postComment(threadId!, text, repliesTo),
      onSuccess: () => {
        setText("");
        textAreaRef.current!.style.height = "auto";
        queryClient.invalidateQueries({ queryKey: ["comments", threadId] });
        queryClient.invalidateQueries({ queryKey: ["thread", threadId] });
      },
    });

    const handlePost = () => {
      if (!text.trim()) return;

      if (type === "comment") {
        commentMutate();
      } else {
        threadMutate();
      }
    };
    const isPending = type === "comment" ? isPendintComment : isPendintThread;

    // Функция для фокусировки на textarea
    const handleFocus = () => {
      textAreaRef.current?.focus();
    };

    const handleIconClick = () => {
      fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files) {
        const fileArray = Array.from(files);
        setImageFile((prev) => [...(prev ?? []), ...fileArray]);
      }
    };

    return (
      // Добавляем onClick для фокусировки
      <div className="h-auto w-full" onClick={handleFocus}>
        <div className="flex gap-3 p-4">
          {/* Аватар или иконка пользователя */}
          <UserIcon size={repliesTo ? "md" : "lg"} />

          {/* Блок с textarea и кнопкой */}
          <div className="flex w-full flex-col gap-1">
            <Textarea
              ref={textAreaRef}
              placeholder="Type something interesting here"
              value={text}
              onChange={handleChange}
              rows={1}
            />
            <div className={cn("flex w-full items-center justify-end gap-2")}>
              <CircularTextLimit textLength={text.length} />
              {repliesTo && (
                <Button onClick={onCancel} variant={"create"}>
                  Cancel
                </Button>
              )}

              <Button
                variant={"create"}
                onClick={handlePost}
                disabled={isPending || !text.trim()}
                className={cn(
                  text && !isPending && "bg-primaryGreen text-bgDarker",
                )}
              >
                {isPending ? "..." : "Post"}
              </Button>
            </div>
            {imageFile && imageFile.length > 0 && (
              <ImagePreview images={imageFile} />
            )}
            {type === "thread" && (
              <div>
                <SharePhotoIcon
                  onClick={handleIconClick}
                  className="cursor-pointer fill-textGray"
                />
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  className="hidden"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    );
  },
);
