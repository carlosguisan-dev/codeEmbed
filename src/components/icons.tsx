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
            <path d="M7 8l-4 4 4 4" />
            <path d="M17 8l4 4-4 4" />
            <path d="m14 4-4 16" />
        </svg>
    )
}
