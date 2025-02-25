import { motion } from "framer-motion";

const PageTransition = ( OverridedPage ) => {
    return () => (
        <>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
            >
                <OverridedPage />
            </motion.div>
        </>
        
    )
}

export default PageTransition;