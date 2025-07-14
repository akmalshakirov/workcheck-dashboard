import { motion } from "framer-motion";
import { useState } from "react";

/**@param {{ fileList: Array, className?: string | undefined, label?: string, name: string, onChange: function }} */

export const UploadImage = ({
    fileList = [],
    className,
    label,
    name = "image",
    onChange,
}) => {
    const [image, setImage] = useState(null);

    const handleChange = (e) => {
        const file = e.target.files && e.target.files[0];
        setImage(file);
        if (onChange) onChange(file);
    };

    const displayImage = fileList && fileList.length > 0 ? fileList[0] : image;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={className}>
            <label htmlFor={name} className='cursor-pointer'>
                {label ? label : "Rasm tanlang:"}
                <input
                    type='file'
                    hidden
                    id={name}
                    autoComplete='off'
                    name={name}
                    onChange={handleChange}
                />
            </label>
            {displayImage && (
                <img
                    src={
                        typeof displayImage === "string"
                            ? displayImage
                            : URL.createObjectURL(displayImage)
                    }
                    alt='Image'
                    className='object-contain rounded-lg'
                />
            )}
        </motion.div>
    );
};

export default UploadImage;
