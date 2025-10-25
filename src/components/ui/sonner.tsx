"use client";

import { useTheme } from "next-themes@0.4.6";
import type { CSSProperties } from "react";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      style={
        { 
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--success-bg": "var(--accent)",
          "--success-text": "var(--accent-foreground)",
          "--error-bg": "var(--destructive)",
          "--error-text": "var(--destructive-foreground)",
        } as CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
