import { useState } from "react";
import { createPortal } from "react-dom";

interface ImageModalProps {
  images: string[];
  selectedImageIndex: number;
  onClose?: () => void;
}

export const ImageModal = ({
  images,
  selectedImageIndex,
  onClose,
}: ImageModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(selectedImageIndex);

  const goPrev = () => setCurrentIndex((prev) => Math.max(prev - 1, 0));
  const goNext = () =>
    setCurrentIndex((prev) => Math.min(prev + 1, images.length - 1));

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80"
      onClick={onClose}
    >
      <button
        className="absolute left-4 text-3xl text-white"
        onClick={(e) => {
          e.stopPropagation();
          goPrev();
        }}
        disabled={currentIndex === 0}
      >
        {"<"}
      </button>
      <img
        src={images[currentIndex]}
        className="max-h-[90%] max-w-[90%] rounded-lg shadow-lg"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        className="absolute right-4 text-3xl text-white"
        onClick={(e) => {
          e.stopPropagation();
          goNext();
        }}
        disabled={currentIndex === images.length - 1}
      >
         {">"}
      </button>
    </div>,
    document.body,
  );
};
