import React from "react";

export function FeedSkeleton() {
  // Допустим, что нужно отобразить 5 "скелетонов"
  const skeletonCount = 8;

  return (
    <div className="space-y-2">
      {Array.from({ length: skeletonCount }).map((_, idx) => (
        <div
          key={idx}
          className="flex min-h-[96px] w-full animate-pulse gap-x-3 border-b border-gray-800 p-4"
        >
          {/* Аватар */}
          <div>
            <div className="h-9 w-9 rounded-full bg-borderColor" />
          </div>

          {/* Правая часть: имя + текст + кнопки */}
          <div className="flex w-full flex-col gap-y-3">
            {/* Имя */}
            <div className="h-4 w-1/3 rounded bg-borderColor" />
            {/* Основной текст треда */}
            <div className="h-6 w-full rounded bg-borderColor" />
          </div>
        </div>
      ))}
    </div>
  );
}
