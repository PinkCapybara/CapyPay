import React from "react";

export const Center = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex h-full flex-col justify-center">
      <div className="flex justify-center">{children}</div>
    </div>
  );
};
