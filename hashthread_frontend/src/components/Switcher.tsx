"use client";
import { cn } from "@/shared/lib/utils";
import { useSwitcher } from "@/shared/store/Switcher";
import { memo } from "react";

export const Switcher = memo(() => {
  const { setSort, sort } = useSwitcher();
  return (
    <div className="rounded-lg border-[1px] border-borderColor bg-bgDark p-[2px]">
      <button
        onClick={() => setSort("popular")}
        className={cn(
          "px-3 py-1 text-textGray",
          sort === "popular" && "rounded-lg bg-[#CCCCCC] text-bgDarker",
        )}
      >
        Popular
      </button>
      <button
        onClick={() => setSort("new")}
        className={cn(
          "px-3 py-1 text-textGray",
          sort === "new" && "rounded-lg bg-[#CCCCCC] text-bgDarker",
        )}
      >
        New
      </button>
    </div>
  );
});
