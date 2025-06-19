import React, { useEffect, useRef, useState } from "react";
import styles from "./Dropdown.module.css";

const Dropdown = ({ options, placeholder = "Tanlang..." }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);
    const dropdownRef = useRef(null);
    const [animateOut, setAnimateOut] = useState(false);

    const handleToggle = () => {
        if (isOpen) {
            setAnimateOut(true);
        } else {
            setAnimateOut(false);
            setIsOpen(true);
        }
    };

    const handleOptionClick = (option) => {
        setSelectedOption(option);
        setAnimateOut(true);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target)
            ) {
                if (isOpen) {
                    setAnimateOut(true);
                }
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [isOpen]);

    const handleAnimationEnd = () => {
        if (animateOut) {
            setIsOpen(false);
            setAnimateOut(false);
        }
    };

    return (
        <div className={styles.dropdownContainer} ref={dropdownRef}>
            <button onClick={handleToggle} className={styles.dropdownButton}>
                <span>
                    {selectedOption ? selectedOption.label : placeholder}
                </span>
                <svg
                    className={`${styles.dropdownIcon} ${
                        isOpen
                            ? styles.dropdownIconSpinIn
                            : styles.dropdownIconSpinOut
                    }`}
                    xmlns='http://www.w3.org/2000/svg'
                    viewBox='0 0 20 20'
                    fill='currentColor'>
                    <path
                        fillRule='evenodd'
                        d='M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z'
                        clipRule='evenodd'
                    />
                </svg>
            </button>

            {(isOpen || animateOut) && (
                <div
                    className={`${styles.dropdownMenu} ${
                        animateOut
                            ? styles.dropdownMenuExit
                            : styles.dropdownMenuEnter
                    }`}
                    onAnimationEnd={handleAnimationEnd}>
                    <ul className={styles.dropdownList}>
                        {options.map((option) => (
                            <li
                                key={option.value}
                                onClick={() => handleOptionClick(option)}
                                className={styles.dropdownItem}>
                                {option.label}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default Dropdown;
