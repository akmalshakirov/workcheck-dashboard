/**
 * @param {{className:string}}
 */
export const Skeleton = ({ className }) => {
    return (
        <>
            <div
                className={`bg-gradient-to-r from-gray-300 to-gray-400/60 dark:from-gray-600 dark:to-gray-700 rounded ${className} animate-pulse dark:bg-gray-600`}
            />
        </>
    );
};
