"use client";
import ShareIcon from "../icons/ShareIcon";
import { Button } from "./ui/button";
import { ThreadItems } from "@/shared/api/types/types";
import { useToggleLikeThread } from "@/shared/lib/hooks/useToggleLikeThread";
import { UserIcon } from "./UserIcon";
import { LikeButton } from "./LikeButton";
import { CommentButton } from "./CommentButton";
import { memo, useState } from "react";
import { ImageModal } from "./ImageModal";
import { cn } from "@/shared/lib/utils";
import { useToogleComments } from "@/shared/store/ToogleComments";
import { Swiper, SwiperSlide } from "swiper/react";
import { toast } from "react-toastify";
import { CopyIcon } from "@/icons/CopyIcon";

import "swiper/css";

interface ThreadComponentProps {
  thread: ThreadItems;
  border?: boolean;
  href?: string;
  type?: "threadPage";
}
export const Thread = memo(
  ({ thread, border = true, href, type }: ThreadComponentProps) => {
    const { mutate: toggleLike, isPending } = useToggleLikeThread(thread.id);
    const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(
      null,
    );

    const setIsActive = useToogleComments((state) => state.setIsActive);
    const isActive = useToogleComments((state) => state.isActive);

    const toggleComment = () => {
      if (type === "threadPage") {
        setIsActive(!isActive);
      }
    };

    const handleShare = () => {
      const threadLink = `${window.location.origin}/${thread.id}`;
      navigator.clipboard
        .writeText(threadLink)
        .then(() => {
          toast(
            <div className="flex items-center gap-2">
              <CopyIcon />
              <span>Link copied!</span>
            </div>,
            {
              className: "toast-custom-style",
              icon: false,
            },
          );
        })
        .catch(() => {
          toast("❌ Failed to copy.", {
            className: "bg-Gray-dark",
          });
        });
    };

    return (
      <div
        className={cn(
          "min-h-[96px] animate-fadeIn",
          border && "border-b-2 border-borderColor",
        )}
      >
        <div className="flex gap-3 p-4">
          <UserIcon size="lg" />
          <div className="flex w-full flex-col gap-3 overflow-hidden">
            <span className="font-medium text-white">Anonym</span>

            <p className="custom-wrap-class font-inter text-m font-m leading-m text-textWhite">
              {thread.text}
            </p>

            <div>
              <Swiper spaceBetween={8} slidesPerView={3} freeMode={true}>
                {thread.files?.map((item, index) => (
                  <SwiperSlide key={item}>
                    <img
                      onClick={() => setSelectedImageIndex(index)}
                      className="h-60 w-full cursor-pointer select-none rounded-lg object-cover"
                      src={item}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>

            <div className="flex gap-1">
              <LikeButton
                onToggleLike={() => toggleLike()}
                isLiked={thread.isLiked}
                disabled={isPending}
                likeCount={thread.likeCount}
              />
              <CommentButton
                href={href}
                isActive={isActive}
                count={thread.messageCount}
                onClick={toggleComment}
              />

              <Button onClick={handleShare}>
                <ShareIcon />
              </Button>
            </div>
          </div>
        </div>
        {selectedImageIndex !== null && (
          <ImageModal
            images={thread.files}
            selectedImageIndex={selectedImageIndex}
            onClose={() => setSelectedImageIndex(null)}
          />
        )}
      </div>
    );
  },
);
