"use client";

import { Toaster } from "sonner";
import React from "react";
import { useTheme } from "next-themes";

const ToasterUi = () => {
  const { theme } = useTheme();
  if (typeof theme === "string") {
    return (
      <Toaster
        richColors
        theme={theme as "light" | "dark" | "system" | undefined}
      />
    );
  }
};

export default ToasterUi;
