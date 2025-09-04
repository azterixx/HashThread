import Link from "next/link";
import { Button } from "./ui";
import { cn, formatCount } from "@/shared/lib/utils";
import MessageIcon from "@/icons/MessageIcon";
import { memo } from "react";

interface CommentButtonProps {
  count: number;
  isActive?: boolean;
  href?: string;
  onClick?: () => void;
}
export const CommentButton = memo(
  ({ count, isActive, href, onClick }: CommentButtonProps) => {
    const button = (
      <Button
        onClick={onClick}
        className={cn("px-4 text-textGray", isActive && "text-primaryGreen")}
      >
        <MessageIcon />
        <span>{formatCount(count)}</span>
      </Button>
    );

    return href ? <Link href={href}>{button}</Link> : button;
  },
);
