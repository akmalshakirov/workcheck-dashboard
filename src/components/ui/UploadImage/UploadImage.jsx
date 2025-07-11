import { motion } from "framer-motion";
import { useState } from "react";

/**@param {{ fileList: () => void, className?: string | undefined, label: string, name: string }} */

export const UploadImage = ({ fileList, className, label, name }) => {
    const [image, setImage] = useState([]);

    console.log(image);

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={className}>
            <label htmlFor='image' className='cursor-pointer'>
                {label ? label : "Rasm tanlang:"}
                <input
                    type='file'
                    hidden
                    id='image'
                    autoComplete='off'
                    name={name ? name : "image"}
                    onChange={(e) => setImage(e.target.files)}
                />
            </label>
            <img
                src={
                    fileList.length && URL?.createObjectURL(fileList[0])
                        ? fileList
                        : image
                        ? image
                        : image
                }
                alt='Image'
                className='object-contain rounded-lg'
            />
        </motion.div>
    );
};
