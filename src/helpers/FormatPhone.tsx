import React, { useEffect, useState } from "react";

type PhoneInputProps<T> = {
    value: string;
    onChange: (e: any) => void;
    className?: string;
    label?: string;
    required?: boolean;
    name?: string;
    placeholder?: string;
    disabled?: boolean;
    focused?: boolean;
};

const PhoneInput = ({
    value,
    onChange,
    className,
    label,
    required,
    name,
    placeholder,
    disabled,
    focused,
}: PhoneInputProps<HTMLInputElement>) => {
    const [formattedValue, setFormattedValue] = useState("");

    const getOnlyDigits = (val: string) => val?.replace(/\D/g, "");

    const formatPhoneNumber = (phoneNumber: string) => {
        const digits = getOnlyDigits(phoneNumber);
        const digitsLength = digits?.length;

        if (digitsLength === 0) return "";
        if (digitsLength <= 2) return `(${digits}`;
        if (digitsLength <= 5)
            return `(${digits?.substring(0, 2)})-${digits?.substring(2)}`;
        if (digitsLength <= 7)
            return `(${digits?.substring(0, 2)})-${digits?.substring(
                2,
                5
            )}-${digits?.substring(5)}`;
        return `(${digits?.substring(0, 2)})-${digits?.substring(
            2,
            5
        )}-${digits?.substring(5, 7)}-${digits?.substring(7, 9)}`;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const inputValue = e.target.value;
        const digits = getOnlyDigits(inputValue);

        if (digits.length <= 9) {
            onChange(digits);
        }
    };

    useEffect(() => {
        setFormattedValue(formatPhoneNumber(value));
    }, [value]);

    return (
        <div className={className}>
            {label && (
                <label htmlFor={name} className='block my-1'>
                    {label}
                </label>
            )}
            <input
                type='text'
                id={name}
                name={name}
                value={formattedValue}
                onChange={handleChange}
                disabled={disabled}
                className='text-base focus:border-blue-400 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 duration-150 border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 w-full transition'
                required={required}
                placeholder={placeholder ? placeholder : "+998-(xx)-xxx-xx-xx"}
                autoComplete='tel'
                autoFocus={focused}
            />
        </div>
    );
};

export default PhoneInput;
