import { cn } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  username: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "w-9 h-9 text-sm",
  md: "w-12 h-12 text-lg",
  lg: "w-16 h-16 text-xl",
};

export function InitialAvatar({
  username,
  size = "sm",
  className,
  ...props
}: AvatarProps) {
  const initial = username ? username.charAt(0).toUpperCase() : "?";
  const bgColor = stringToColor(username);

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center font-semibold text-white",
        sizeClasses[size],
        className
      )}
      style={{ backgroundColor: bgColor }}
      {...props}
    >
      {initial}
    </div>
  );
}

// Generate consistent colors based on username
function stringToColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 65%, 55%)`;
}
