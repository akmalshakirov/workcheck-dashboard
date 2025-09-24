import { useEffect, useState } from "react";
const PhoneInput = ({
    value,
    onChange,
    className = "",
    label = "",
    required = false,
    name = "",
    placeholder = "",
    disabled = false,
}) => {
    const [formattedValue, setFormattedValue] = useState("");

    const getOnlyDigits = (val) => val?.replace(/\D/g, "");

    const formatPhoneNumber = (phoneNumber) => {
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

    const handleChange = (e) => {
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
        <div className={`${className}`}>
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
                className='w-full border rounded-lg border-gray-500/70 px-3 py-2 text-base outline-none focus:border-blue-400 duration-150 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed'
                required={required}
                placeholder={placeholder ? placeholder : "+998-(xx)-xxx-xx-xx"}
                autoComplete='tel'
            />
        </div>
    );
};

export default PhoneInput;
