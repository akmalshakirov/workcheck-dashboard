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

    const displayImage =
        image?.length > 0 ? URL?.createObjectURL(image) : fileList;

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
            <img
                src={
                    image
                        ? URL.createObjectURL(image)
                        : image
                        ? displayImage
                        : fileList
                }
                alt={`Image is uploading... ${fileList}`}
                className='object-contain rounded-lg'
            />
            {/* {displayImage && (
                <img
                    src={
                        typeof displayImage === "string"
                            ? displayImage
                            : URL.createObjectURL(displayImage)
                    }
                    alt='Image'
                    className=''
                />
            )} */}
        </motion.div>
    );
};

export default UploadImage;
