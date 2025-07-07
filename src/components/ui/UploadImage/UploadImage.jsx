import { motion } from "framer-motion";
import { CloudUpload } from "lucide-react";
import React, { useRef, useState } from "react";

/**@param {{onFileBinary?: (binary: ArrayBuffer, fileName: string) => void}} props*/
export default function UploadImage({ onFileBinary }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const inputRef = useRef(null);

    const processFile = (selected) => {
        setFile(selected);
        setPreview(URL.createObjectURL(selected));
        const reader = new FileReader();
        reader.onload = () => {
            const arrayBuffer = reader.result;
            if (onFileBinary) {
                onFileBinary(arrayBuffer, selected.name);
            }
        };
        reader.readAsArrayBuffer(selected);
    };

    const handleFileChange = (e) => {
        const selected = e.target.files[0];
        if (selected) {
            processFile(selected);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            processFile(e.dataTransfer.files[0]);
        }
    };

    const openFileDialog = () => {
        inputRef.current.click();
    };

    return (
        <div className='flex flex-col items-center justify-center'>
            <motion.div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openFileDialog}
                className={`w-full max-w-md border-2 border-dashed rounded-xl transition-colors ${
                    dragActive
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-300 bg-white dark:bg-black/20"
                }`}>
                <div className='flex flex-col p-6 items-center justify-center cursor-pointer'>
                    <CloudUpload className='w-12 h-12 text-gray-400 mb-3' />
                    <p className='text-gray-600 dark:text-gray-300'>
                        Rasmni tanlash uchun bosing
                    </p>
                    <input
                        type='file'
                        accept='image/*'
                        className='hidden'
                        ref={inputRef}
                        onChange={handleFileChange}
                        name='adminImage'
                    />
                </div>
            </motion.div>

            {preview && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='mt-4 flex flex-col items-center'>
                    <img
                        src={preview}
                        alt='Preview'
                        className='w-20 h-20 object-cover rounded-lg shadow-md'
                    />
                    <p className='mt-2 text-green-700'>
                        Tanlangan fayl: <strong>{file.name}</strong>
                    </p>
                </motion.div>
            )}
        </div>
    );
}
