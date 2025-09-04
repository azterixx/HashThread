import { cn } from "@/shared/lib/utils";
import * as React from "react";
import { SVGProps } from "react";

interface MessageIconProps {
  className?: string;
}

const MessageIcon = ({ className }: MessageIconProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    className={cn("fill-textGray", className)}
  >
    <path
      fill="currentColor"
      d="m19.2 20-.238.711a.75.75 0 0 0 .966-.893L19.2 20Zm-.8-3.2-.6-.45-.214.286.086.347.728-.182ZM16 18.93l.238-.712-.32-.107-.293.17.375.649Zm-4 .32A7.25 7.25 0 0 1 4.75 12h-1.5A8.75 8.75 0 0 0 12 20.75v-1.5ZM4.75 12A7.25 7.25 0 0 1 12 4.75v-1.5A8.75 8.75 0 0 0 3.25 12h1.5ZM12 4.75A7.25 7.25 0 0 1 19.25 12h1.5A8.75 8.75 0 0 0 12 3.25v1.5ZM19.25 12c0 1.633-.54 3.139-1.45 4.35l1.2.901A8.715 8.715 0 0 0 20.75 12h-1.5Zm-1.578 4.983.8 3.199 1.456-.364-.8-3.2-1.456.365Zm1.766 2.306-3.2-1.07-.476 1.422 3.2 1.07.476-1.422Zm-3.813-1.009a7.213 7.213 0 0 1-3.625.97v1.5a8.712 8.712 0 0 0 4.375-1.171l-.75-1.299Z"
    />
  </svg>
);
export default MessageIcon;
