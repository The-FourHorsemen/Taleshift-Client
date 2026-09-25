import type { SVGProps } from "react";

export function GridIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="2" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="10" y="2" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="2" y="10" width="6" height="6" rx="1" fill="currentColor" />
      <rect x="10" y="10" width="6" height="6" rx="1" fill="currentColor" />
    </svg>
  );
}

export function RosterIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <circle cx="7" cy="4" r="3" stroke="currentColor" strokeWidth="1.6" />
      <path d="M1 15C1 11.5 3.5 9.5 7 9.5C10.5 9.5 13 11.5 13 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M14 5C15.1 5 16 5.9 16 7C16 8.1 15.1 9 14 9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M15 9.7C17.3 10.3 19 11.9 19 15" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

export function PulseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M1 9H5L7 3L11 15L13 9H17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function LineUpIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 15L7 9L10.5 12L16 5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 5H16V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function ResourcesIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="3" width="14" height="12" rx="1.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M2 7H16" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export function FlagIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M2 1V17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M2 2H13L10.5 5.5L13 9H2" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    </svg>
  );
}

export function BarChartIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <rect x="2" y="9" width="3.5" height="7" rx="0.8" fill="currentColor" />
      <rect x="7.5" y="4" width="3.5" height="12" rx="0.8" fill="currentColor" />
      <rect x="13" y="7" width="3.5" height="9" rx="0.8" fill="currentColor" />
    </svg>
  );
}
