"use client";

import { memo, useEffect, useState } from "react";

interface ImagePreviewProps {
  images: File[];
}
export const ImagePreview = memo(({ images }: ImagePreviewProps) => {
  const [previews, setPreviews] = useState<string[]>([]);

  useEffect(() => {
    const objectUrls = images.map((file) => URL.createObjectURL(file));
    setPreviews(objectUrls);

    return () => {
      objectUrls.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [images]);

  return (
    <div className="mb-2 flex flex-wrap gap-2">
      {previews.map((src) => (
        <div key={src} className="relative h-44 w-44">
          <img
            src={src}
            alt={`preview-${src}`}
            className="h-full w-full rounded-[8px] object-cover"
          />
        </div>
      ))}
    </div>
  );
});
