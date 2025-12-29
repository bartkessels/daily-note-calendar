import React, { useEffect, useRef } from "react";
import { setIcon } from "obsidian";

interface ObsidianIconProps {
  icon: string;
  size?: number;
  onClick?: () => void;
  className?: string;
}

export const ObsidianIcon: React.FC<ObsidianIconProps> = ({
  icon,
  size = 18,
  onClick,
  className,
}) => {
  const iconRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (iconRef.current) {
      setIcon(iconRef.current, icon as any);
    }
  }, [icon]);

  return (
    <span
      ref={iconRef}
      onClick={onClick}
      className={className}
      style={{
        display: "inline-flex",
        width: `${size}px`,
        height: `${size}px`,
        cursor: onClick ? "pointer" : "default",
      }}
    />
  );
};
