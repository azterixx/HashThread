import { cn, formatCount } from "@/shared/lib/utils";
import { Button } from "./ui";
import FlameIcon from "@/icons/FlameIcon";
import BurningFlameIcon from "@/icons/BurningFlameIcon";
import { memo } from "react";

interface LikeButtonProps {
  onToggleLike: () => void;
  isLiked: boolean;
  likeCount: number;
  disabled?: boolean;
}

export const LikeButton = memo(
  ({ onToggleLike, disabled, isLiked, likeCount }: LikeButtonProps) => {
    return (
      <Button onClick={onToggleLike} disabled={disabled} className="px-4">
        {isLiked ? (
          <BurningFlameIcon className="text-primaryGreen" />
        ) : (
          <FlameIcon className={"text-textGray"} />
        )}
        <span className={cn("text-textGray", isLiked && "text-primaryGreen")}>
          {formatCount(likeCount)}
        </span>
      </Button>
    );
  },
);
