// src/components/Layout.tsx
import React from "react";
import { ThemeToggle } from "./ThemeToggle";

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div>
      {/* You can place the theme toggle in a header, sidebar, etc. */}
      <header className="p-4">
        <ThemeToggle />
      </header>
      <main>{children}</main>
    </div>
  );
};
