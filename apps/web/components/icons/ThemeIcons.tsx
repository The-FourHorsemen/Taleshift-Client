import type { SVGProps } from "react";

export function SunIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="10" cy="10" r="4" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M10 1.5V3.5M10 16.5V18.5M18.5 10H16.5M3.5 10H1.5M15.8 4.2L14.4 5.6M5.6 14.4L4.2 15.8M15.8 15.8L14.4 14.4M5.6 5.6L4.2 4.2"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function MoonIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M17.5 11.5C16.4 12.1 15.1 12.5 13.8 12.5C9.7 12.5 6.4 9.2 6.4 5.1C6.4 3.8 6.7 2.5 7.4 1.4C4 2.4 1.5 5.6 1.5 9.3C1.5 13.9 5.2 17.6 9.8 17.6C13.5 17.6 16.6 15.2 17.5 11.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}
