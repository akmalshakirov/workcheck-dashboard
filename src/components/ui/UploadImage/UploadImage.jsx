import { motion } from "framer-motion";
import { AlertCircle, CheckCircle, CloudUpload, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";

/**
 * @param {{
 *   onFileBinary?: (binary: ArrayBuffer, fileName: string) => void,
 *   maxFileSize?: number,
 *   acceptedTypes?: string[],
 *   className: string
 * }} props
 */

export default function UploadImage({
    onFileBinary,
    maxFileSize = 5 * 1024 * 1024,
    acceptedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
    className = "",
}) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const inputRef = useRef(null);

    useEffect(() => {
        return () => {
            if (preview) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    const validateFile = useCallback(
        (selectedFile) => {
            if (!acceptedTypes.includes(selectedFile.type)) {
                return `Faqat ${acceptedTypes.join(
                    ", "
                )} formatidagi fayllar qabul qilinadi`;
            }

            if (selectedFile.size > maxFileSize) {
                const maxSizeMB = (maxFileSize / (1024 * 5)).toFixed(1);
                return `Fayl hajmi ${maxSizeMB}MB dan oshmasligi kerak`;
            }

            return null;
        },
        [acceptedTypes, maxFileSize]
    );

    const processFile = useCallback(
        (selected) => {
            setError(null);
            setIsProcessing(true);

            const validationError = validateFile(selected);
            if (validationError) {
                setError(validationError);
                setIsProcessing(false);
                return;
            }

            if (preview) {
                URL.revokeObjectURL(preview);
            }

            setFile(selected);
            const newPreview = URL.createObjectURL(selected);
            setPreview(newPreview);

            const reader = new FileReader();
            reader.onload = () => {
                const arrayBuffer = reader.result;
                if (onFileBinary) {
                    onFileBinary(arrayBuffer, selected.name);
                }
                setIsProcessing(false);
            };
            reader.onerror = () => {
                setError("Faylni o'qishda xatolik yuz berdi");
                setIsProcessing(false);
            };
            reader.readAsArrayBuffer(selected);
        },
        [onFileBinary, preview, validateFile]
    );

    const handleFileChange = useCallback(
        (e) => {
            const selected = e.target.files?.[0];
            if (selected) {
                processFile(selected);
            }
        },
        [processFile]
    );

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback(
        (e) => {
            e.preventDefault();
            e.stopPropagation();
            setDragActive(false);

            const droppedFile = e.dataTransfer.files?.[0];
            if (droppedFile) {
                processFile(droppedFile);
            }
        },
        [processFile]
    );

    const openFileDialog = useCallback(() => {
        inputRef.current?.click();
    }, []);

    const removeFile = useCallback(() => {
        if (preview) {
            URL.revokeObjectURL(preview);
        }
        setFile(null);
        setPreview(null);
        setError(null);
        setIsProcessing(false);

        if (inputRef.current) {
            inputRef.current.value = "";
        }
    }, [preview]);

    const formatFileSize = useCallback((bytes) => {
        if (bytes === 0) return "0 Bytes";
        const k = 1024;
        const sizes = ["Bytes", "KB", "MB", "GB"];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
    }, []);

    return (
        <div
            className={`flex flex-col items-center justify-center ${className}`}>
            <motion.div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                initial={{ scale: 1 }}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={openFileDialog}
                className={`w-full max-w-md border-2 border-dashed rounded-xl transition-all duration-300 cursor-pointer ${
                    dragActive
                        ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                        : error
                        ? "border-red-300 bg-red-50 dark:bg-red-900/20"
                        : "border-gray-300 bg-white dark:bg-black/20 hover:border-gray-400"
                }`}>
                <div className='flex flex-col p-6 items-center justify-center'>
                    {isProcessing ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                                duration: 1,
                                repeat: Infinity,
                                ease: "linear",
                            }}
                            className='w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full mb-3'
                        />
                    ) : (
                        <motion.div
                            initial={{ scale: 1 }}
                            animate={{ scale: dragActive ? 1.1 : 1 }}
                            transition={{ duration: 0.2 }}>
                            <CloudUpload
                                className={`w-12 h-12 mb-3 ${
                                    error ? "text-red-400" : "text-gray-400"
                                }`}
                            />
                        </motion.div>
                    )}

                    <p
                        className={`text-center ${
                            error
                                ? "text-red-600 dark:text-red-400"
                                : "text-gray-600 dark:text-gray-300"
                        }`}>
                        {isProcessing
                            ? "Fayl qayta ishlanmoqda..."
                            : error
                            ? error
                            : "Rasmni tanlash uchun bosing yoki shu yerga tashlang"}
                    </p>

                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                        Maksimal hajm: {formatFileSize(maxFileSize)}
                    </p>

                    <input
                        type='file'
                        accept={acceptedTypes.join(",")}
                        className='hidden'
                        ref={inputRef}
                        onChange={handleFileChange}
                        name='adminImage'
                    />
                </div>
            </motion.div>

            {preview && file && (
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className='mt-4 flex flex-col items-center relative'>
                    <div className='relative'>
                        <motion.img
                            src={preview}
                            alt='Preview'
                            className='w-32 h-32 object-cover rounded-lg shadow-md'
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            transition={{ duration: 0.3 }}
                        />
                        <motion.button
                            onClick={removeFile}
                            className='absolute -top-2 -right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-lg'
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}>
                            <X className='w-4 h-4' />
                        </motion.button>
                    </div>

                    <div className='mt-3 text-center'>
                        <div className='flex items-center justify-center space-x-2'>
                            <CheckCircle className='w-4 h-4 text-green-500' />
                            <p className='text-green-700 dark:text-green-400 font-medium'>
                                {file.name}
                            </p>
                        </div>
                        <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                            {formatFileSize(file.size)}
                        </p>
                    </div>
                </motion.div>
            )}

            {error && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='mt-4 flex items-center space-x-2 text-red-600 dark:text-red-400'>
                    <AlertCircle className='w-4 h-4' />
                    <p className='text-sm'>{error}</p>
                </motion.div>
            )}
        </div>
    );
}
