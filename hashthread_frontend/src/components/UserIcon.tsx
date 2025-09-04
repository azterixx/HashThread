import Avatar from "boring-avatars";
import { memo } from "react";

interface UserIconProps {
  size: "lg" | "md";
}

export const UserIcon = memo(({ size }: UserIconProps) => {
  const avatarSize = size === "lg" ? 36 : 24;
  const randomName = Math.random().toString();

  const colors = [
    "#52FB18",
    "#2E2E2E",
    "#F3F5F7",
    "#999999",
    "#1E1E1E",
    "#323232",
  ];

  const variants = ["beam", "bauhaus", "marble", "pixel"] as const;
  const randomVariant = variants[Math.floor(Math.random() * variants.length)];

  return (
    <Avatar
      size={avatarSize}
      name={randomName}
      variant={randomVariant}
      colors={colors}
    />
  );
});
