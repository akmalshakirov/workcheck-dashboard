import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./Modal.module.css";

const Modal = ({ visible, title, onCancel, onOk, children, Disable }) => {
    const { t } = useTranslation();
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
                        className={`${styles.modal} bg-[rgba(255,255,255,0.89)] dark:bg-[rgba(15,15,15,0.95)] dark:text-white text-black`}
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
                        <div className={styles.footer}>
                            <button
                                className={`${styles.cancelBtn} bg-red-600/80 hover:bg-red-600 duration-150 text-white active:scale-[0.95] will-change-transform`}
                                onClick={onCancel}>
                                {t("cancel")}
                            </button>
                            <button
                                className={`${
                                    styles.okBtn
                                } bg-[#126ac9] duration-150 hover:bg-[#007bff] ${
                                    Disable
                                        ? "opacity-30 cursor-not-allowed!"
                                        : "pointer-events-auto active:scale-[0.95] will-change-transform"
                                }`}
                                onClick={onOk}
                                type='submit'
                                disabled={Disable}>
                                {t("ok")}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default Modal;
