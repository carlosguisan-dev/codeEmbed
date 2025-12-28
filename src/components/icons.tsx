import type { SVGProps } from 'react';

export function Logo(props: SVGProps<SVGSVGElement>) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            {...props}
        >
            <path d="M10 16.5 8 18l-2-1.5" />
            <path d="m14 16.5 2 1.5 2-1.5" />
            <path d="M9 8 7.5 9.5 9 11" />
            <path d="m15 8 1.5 1.5-1.5 1.5" />
            <path d="M14 22V4a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v18" />
            <path d="M18 22V8a2 2 0 0 0-2-2h-4" />
        </svg>
    )
}
