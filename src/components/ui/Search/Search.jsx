import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { baseURL } from "../../../App";

export const Search = () => {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const debounceRef = useRef(null);
    const { t } = useTranslation();
    const token = localStorage.getItem("token");
    const lang = localStorage.getItem("lang");

    const fetchResults = async (q) => {
        if (!q.trim()) {
            setResults([]);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { data } = await axios.get(`${baseURL}/admins`, {
                params: { q },
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: lang,
                },
            });
            setResults(data.admins);
        } catch (error) {
            setError(error.response?.data?.error || error.code);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const v = e.target.value;
        setQuery(v);

        clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            fetchResults(v);
        }, 500);
    };

    const searchId = Math.random().toString(36).slice(2, 9);

    return (
        <div className='max-w-md mx-auto hidden md:block relative'>
            <input
                type='text'
                value={query}
                onChange={handleChange}
                className='px-2 py-1 border border-gray-700 rounded-lg outline-none focus:bg-gray-800/10 transition-colors placeholder-black/30 dark:placeholder-white/30 dark:focus:bg-gray-600/40'
                placeholder={`${t("search")}...`}
                name='search'
                id={searchId}
                autoComplete='on'
            />

            {(loading !== false || error !== null) && (
                <motion.div
                    className='bg-white/90 absolute top-12 p-2 rounded-lg dark:bg-black shadow'
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}>
                    {loading && (
                        <motion.p
                            className='italic text-gray-500 p-1'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}>
                            {t("preloader")}
                        </motion.p>
                    )}

                    {error && (
                        <motion.p
                            className='text-sm italic text-red-400 dark:text-red-700
                         border border-red-500 rounded p-1 bg-red-100/70 dark:bg-red-200/30'
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}>
                            Xatolik yuz berdi: {error}
                        </motion.p>
                    )}
                </motion.div>
            )}

            {results.length !== 0 && (
                <motion.div
                    className='bg-white/90 absolute top-12 p-2 rounded-lg dark:bg-black shadow'
                    initial={{ y: -5, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: -5, opacity: 0 }}>
                    <ul>
                        <AnimatePresence>
                            {results.map((item) => (
                                <motion.li
                                    key={item.id}
                                    className='px-4 py-2 flex flex-col gap-3 hover:bg-gray-50 cursor-pointer'
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 10 }}
                                    transition={{ duration: 0.2 }}>
                                    {item.name}
                                    {item.username}
                                    {item.role}
                                    {item.branch.name}
                                </motion.li>
                            ))}

                            {!loading &&
                                !error &&
                                query &&
                                results.length === 0 && (
                                    <motion.li className='px-4 py-2 text-gray-500 italic'>
                                        Natija topilmadi
                                    </motion.li>
                                )}
                        </AnimatePresence>
                    </ul>
                </motion.div>
            )}
        </div>
    );
};
