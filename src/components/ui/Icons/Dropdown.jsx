import React from "react";

export default function DropdowIcon({ ...props }) {
    return (
        <svg
            className={`w-5 h-5 text-gray-800 dark:text-white ${props}`}
            aria-hidden='true'
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 25 25' {...props}>
            <path
                stroke='currentColor'
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth='2.5'
                d='m19 9-7 7-7-7'
            />
        </svg>
    );
}
