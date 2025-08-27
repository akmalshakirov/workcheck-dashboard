import { motion, useReducedMotion } from "framer-motion";

export const PageWrapper = ({ children }) => {
    const shouldReduce = useReducedMotion();
    const variants = {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
    };

    if (shouldReduce) {
        return <>{children}</>;
    }

    return (
        <motion.div
            variants={variants}
            initial='initial'
            animate='animate'
            exit='exit'
            style={{ position: "relative" }}>
            {children}
        </motion.div>
    );
};
