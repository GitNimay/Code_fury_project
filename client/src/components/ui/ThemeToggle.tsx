// src/components/ThemeToggle.tsx
import React from "react";

export const ThemeToggle: React.FC = () => {
  return (
    <>
      {/* Hidden checkbox */}
      <input className="peer sr-only" id="theme" type="checkbox" />
      
      {/* Theme toggle label with SVG icons */}
      <label htmlFor="theme" className="theme-toggle" data-light="light" data-dark="dark">
        <svg id="light" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0 -8 0" />
          <path d="M3 12h1m8 -9v1m8 8h1m-9 8v1m-6.4 -15.4l.7 .7m12.1 -.7l-.7 .7m0 11.4l.7 .7m-12.1 -.7l-.7 .7" />
        </svg>

        <svg id="dark" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z" />
        </svg>
      </label>

      {/* Theme mask for dark theme effect */}
      <div className="theme-mask">
        {Array.from({ length: 25 }).map((_, i) => (
          <div key={i} style={{ "--i": i } as React.CSSProperties} />
        ))}
      </div>
    </>
  );
};
