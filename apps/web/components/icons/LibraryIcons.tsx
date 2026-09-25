import type { SVGProps } from "react";

export function UploadCloudIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path
        d="M6 14.5H14.5C16.4 14.5 18 12.9 18 11C18 9.3 16.8 7.9 15.1 7.6C14.9 5.1 12.7 3 10 3C7.5 3 5.4 4.7 4.9 7C3.3 7.4 2 8.9 2 10.7C2 12.8 3.7 14.5 5.8 14.5"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M10 8V16M10 8L7.5 10.5M10 8L12.5 10.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function PdfFileIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M6 2H15L19 6V22H6V2Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <path d="M15 2V6H19" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
      <text x="7.5" y="16.5" fontSize="6.5" fontWeight="700" fill="currentColor">PDF</text>
    </svg>
  );
}

export function CloseIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

export function CheckIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
      <path d="M3 8.5L6.5 12L13 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
