import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import styles from "./Modal.module.css";

const Modal = ({ visible, title = "", children }) => {
    useEffect(() => {
        if (visible) document.documentElement.classList.add("overflow-hidden");
        else document.documentElement.classList.remove("overflow-hidden");
    }, [visible]);

    return (
        <AnimatePresence mode='wait'>
            {visible && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.3,
                    }}>
                    <motion.div
                        className={`${styles.modal} bg-[rgba(255,255,255,0.9)] dark:bg-[rgba(15,15,15,0.99)] dark:text-white text-black`}
                        initial={{ y: -100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        transition={{
                            type: "spring",
                            damping: 30,
                            stiffness: 200,
                        }}>
                        <div
                            className={`${styles.header} border-b border-b-gray-600/30 text-lg dark:border-b-[#777]`}>
                            <h1>{title}</h1>
                        </div>
                        <div className={styles.body}>{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
