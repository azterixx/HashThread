import { memo } from "react";

interface CircularTextLimitProps {
  textLength: number;
}

export const CircularTextLimit = memo(({ textLength }: CircularTextLimitProps) => {
  const maxLength = 500;
  const stepSize = 100 / maxLength;
  const progress = Math.min(Math.round(textLength * stepSize), 100);

  const radius = 14;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (progress / 100) * circumference;

  let strokeColor = "#52FB18";
  if (progress >= 80 && progress < 100) strokeColor = "#F5A623";
  if (progress >= 100) strokeColor = "#FF4D4F";

  return (
    <div className="relative flex items-center justify-center w-8 h-8">
      <svg
        className="transform -rotate-90"
        width="32"
        height="32"
      >
        <circle
          stroke="#323232"
          fill="transparent"
          strokeWidth="3"
          r={radius}
          cx="16"
          cy="16"
        />
        <circle
          stroke={strokeColor}
          fill="transparent"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          r={radius}
          cx="16"
          cy="16"
          style={{
            transition: "stroke-dashoffset 0.1s linear, stroke 0.2s ease",
          }}
        />
      </svg>

      <span
        className={`absolute text-[10px] font-medium ${
          progress >= 100 ? "text-red-500" : "text-textWhite"
        }`}
      >
        {maxLength - textLength}
      </span>
    </div>
  );
});
