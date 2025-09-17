import React, { FC } from "react";

type ButtonProps = {
    variant?: "primary" | "secondary";
    className?: string;
    children: React.ReactNode;
};
const Button: FC<ButtonProps> = ({ className, variant, children }) => {
    return (
        <button
            className={`rounded-lg p-1.5 px-3 bg-blue-600/80 hover:bg-blue-600 text-white active:scale-[0.95] active:bg-blue-700 duration-150 will-change-transform`}>
            {children}
        </button>
    );
};
