import * as React from "react";

import { cn } from "@/shared/lib/utils";

const Textarea = React.memo(
  React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
    ({ className, ...props }, ref) => {
      return (
        <textarea
          className={cn(
            "w-full resize-none overflow-hidden rounded-md border border-transparent bg-bgDark p-2 font-inter text-m text-sm leading-m text-white caret-primaryGreen placeholder:text-textGray focus:outline-none",
            className,
          )}
          ref={ref}
          {...props}
        />
      );
    },
  ),
);
Textarea.displayName = "Textarea";

export { Textarea };
