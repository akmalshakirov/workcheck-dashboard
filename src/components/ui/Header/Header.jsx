import { useEffect, useRef, useState } from "react";
import { BiExitFullscreen, BiFullscreen } from "react-icons/bi";
import {
    TbLayoutSidebarLeftCollapse,
    TbLayoutSidebarRightCollapse,
} from "react-icons/tb";
import styles from "./Header.module.css";
import { CgDarkMode } from "react-icons/cg";

function useClickOutside(ref, handler) {
    useEffect(() => {
        function handleClick(event) {
            if (ref.current && !ref.current.contains(event.target)) {
                handler();
            }
        }
        document.addEventListener("mousedown", handleClick);
        return () => document.removeEventListener("mousedown", handleClick);
    }, [ref, handler]);
}

export const Header = ({ collapsed, setCollapsed }) => {
    const [langOpen, setLangOpen] = useState(false);
    const [langClosing, setLangClosing] = useState(false);
    const [selectedLang, setSelectedLang] = useState({
        code: "uz",
        label: "Oʻzbekcha",
    });

    const [notifOpen, setNotifOpen] = useState(false);
    const [notifClosing, setNotifClosing] = useState(false);

    const [profileOpen, setProfileOpen] = useState(false);
    const [profileClosing, setProfileClosing] = useState(false);

    const [isDark, setIsDark] = useState(false);
    const [isFull, setIsFull] = useState(false);

    const langRef = useRef();
    const notifRef = useRef();
    const profileRef = useRef();

    const closeDropdown = (open, setOpen, setClosing) => {
        if (open) {
            setClosing(true);
            setTimeout(() => {
                setClosing(false);
                setOpen(false);
            }, 250);
        }
    };

    const toggleDropdown = (open, setOpen, setClosing) => {
        if (open) {
            closeDropdown(open, setOpen, setClosing);
        } else {
            setOpen(true);
        }
    };

    useClickOutside(langRef, () =>
        closeDropdown(langOpen, setLangOpen, setLangClosing)
    );
    useClickOutside(notifRef, () =>
        closeDropdown(notifOpen, setNotifOpen, setNotifClosing)
    );
    useClickOutside(profileRef, () =>
        closeDropdown(profileOpen, setProfileOpen, setProfileClosing)
    );

    useEffect(() => {
        document.documentElement.classList.toggle("dark", isDark);
    }, [isDark]);

    useEffect(() => {
        function onFullChange() {
            setIsFull(!!document.fullscreenElement);
        }
        document.addEventListener("fullscreenchange", onFullChange);
        return () =>
            document.removeEventListener("fullscreenchange", onFullChange);
    }, []);

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    };

    const languages = [
        { code: "en", label: "English" },
        { code: "uz", label: "Oʻzbekcha" },
        { code: "ru", label: "Русский" },
    ];
    const notifications = [
        { id: 1, text: "Sizga yangi xabar keldi" },
        { id: 2, text: "Hisobot tayyor" },
        { id: 3, text: "Yangi foydalanuvchi ro‘yxatdan o‘tdi" },
    ];
    const profileActions = [
        {
            id: "profile",
            label: "Profile",
            onClick: () => alert("Profile clicked"),
        },
        {
            id: "settings",
            label: "Settings",
            onClick: () => alert("Settings clicked"),
        },
        {
            id: "logout",
            label: "Logout",
            onClick: () => alert("Logging out..."),
        },
    ];

    return (
        <div className='p-2.5 flex-1 flex items-center justify-between max-h-max bg-white rounded-lg !w-full dark:bg-black/90 dark:text-white'>
            <div className='flex gap-2.5'>
                <button
                    onClick={() => {
                        setCollapsed(!collapsed);
                    }}
                    className='p-1 hover:bg-gray-700/30 duration-50 border border-gray-700 rounded-lg'
                    title={collapsed ? "Menyuni ochish" : "Menyuni yopish"}
                    aria-label={
                        collapsed ? "Menyuni ochish" : "Menyuni yopish"
                    }>
                    {collapsed ? (
                        <TbLayoutSidebarLeftCollapse size={22} />
                    ) : (
                        <TbLayoutSidebarRightCollapse size={22} />
                    )}
                </button>
                <div>
                    <input
                        type='text'
                        className='px-2 py-1 border border-gray-700 rounded-lg outline-none focus:bg-gray-800/10 transition-colors placeholder-black/30 dark:placeholder-white/30 dark:focus:bg-gray-600/40'
                        placeholder='Qidirish...'
                        name='search'
                        id='search'
                    />
                </div>
            </div>
            {/* right side */}
            <div className='flex items-center gap-2.5'>
                <div
                    ref={langRef}
                    className={`${styles.item} dark:text-white`}
                    onClick={() =>
                        toggleDropdown(langOpen, setLangOpen, setLangClosing)
                    }>
                    {selectedLang.label}
                    {(langOpen || langClosing) && (
                        <ul
                            className={`${styles.dropdown} ${
                                langClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } dark:text-white bg-white/70 backdrop-blur-xs dark:bg-black/70 p-1`}>
                            {languages.map((lang) => (
                                <li
                                    key={lang.code}
                                    onClick={() => {
                                        setSelectedLang(lang);
                                        closeDropdown(
                                            true,
                                            setLangOpen,
                                            setLangClosing
                                        );
                                    }}
                                    className='dark:hover:bg-white/20 rounded-lg hover:bg-black/10'>
                                    {lang.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <button
                    className='p-2'
                    onClick={toggleFullscreen}
                    title='Toggle Fullscreen'>
                    {isFull ? (
                        <BiExitFullscreen size={20} />
                    ) : (
                        <BiFullscreen size={20} />
                    )}
                </button>

                <div
                    ref={notifRef}
                    className={styles.item}
                    onClick={() =>
                        toggleDropdown(notifOpen, setNotifOpen, setNotifClosing)
                    }>
                    Xabarlar ({notifications.length})
                    {(notifOpen || notifClosing) && (
                        <ul
                            className={`${styles.dropdown} ${styles.notif} ${
                                notifClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } dark:bg-black/70 bg-white/70 backdrop-blur-xs`}>
                            {notifications.map((n) => (
                                <li
                                    key={n.id}
                                    className='dark:hover:bg-white/20 hover:bg-black/10'>
                                    {n.text}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <label className={styles.switch} htmlFor='switch'>
                    <input
                        id='switch'
                        type='checkbox'
                        checked={isDark}
                        onChange={() => setIsDark((d) => !d)}
                    />
                    <span className={styles.slider}>
                        <span className='rounded-full'>
                            <CgDarkMode size={20} />
                        </span>
                    </span>
                </label>

                <div
                    ref={profileRef}
                    className={styles.item}
                    onClick={() =>
                        toggleDropdown(
                            profileOpen,
                            setProfileOpen,
                            setProfileClosing
                        )
                    }>
                    Profile
                    {(profileOpen || profileClosing) && (
                        <ul
                            className={`${styles.dropdown} ${
                                profileClosing
                                    ? styles.dropdownExit
                                    : styles.dropdownEnter
                            } bg-white/70 backdrop-blur-xs dark:bg-black/70 dark:text-white p-1`}>
                            {profileActions.map((a) => (
                                <li
                                    key={a.id}
                                    onClick={a.onClick}
                                    className='dark:hover:bg-white/20 rounded-lg hover:bg-black/10'>
                                    {a.label}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* right side closed */}
            </div>
        </div>
    );
};
