import React from "react";

export function Card({
  title,
  children,
  className = "",
  scrollHeight = "auto",
}: {
  title: string;
  children?: React.ReactNode;
  className?: string;
  scrollHeight?: "auto" | "sm" | "md" | "lg" | "xl";
}) {
  const heightClass = {
    auto: "",
    sm: "max-h-[20vh]",
    md: "max-h-[20vh]",
    lg: "max-h-[60vh]",
    xl: "max-h-[80vh]",
  }[scrollHeight];

  return (
    <div className={`border p-4 ${className}`}>
      <h1 className="text-xl border-b pb-2">{title}</h1>
      <div className={`overflow-y-auto ${heightClass}`}>{children}</div>
    </div>
  );
}
