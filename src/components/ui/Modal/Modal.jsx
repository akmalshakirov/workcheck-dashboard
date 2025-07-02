import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import styles from "./Modal.module.css";

const Modal = ({ visible, title, onCancel, onOk, children, Disable }) => {
    const { t } = useTranslation();
    return (
        <AnimatePresence mode='popLayout'>
            {visible && (
                <motion.div
                    className={styles.overlay}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{
                        duration: 0.2,
                    }}>
                    <motion.div
                        className={`${styles.modal} bg-white dark:bg-[rgba(0,0,0,0.9)] dark:text-white text-black`}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.5, opacity: 0 }}
                        transition={{
                            type: "spring",
                            stiffness: 300,
                            damping: 25,
                        }}>
                        <div
                            className={`${styles.header} border-b border-b-[#eee] dark:border-b-[#b8b8b8] text-lg`}>
                            <h1>{title}</h1>
                        </div>
                        <div className={styles.body}>{children}</div>
                        <div className={styles.footer}>
                            <button
                                className={`${styles.cancelBtn} bg-red-600/80 hover:bg-red-600 duration-150 text-white`}
                                onClick={onCancel}>
                                {t("cancel")}
                            </button>
                            <button
                                className={`${
                                    styles.okBtn
                                } bg-[#126ac9] duration-150 hover:bg-[#007bff] ${
                                    Disable ? "opacity-30" : ""
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
