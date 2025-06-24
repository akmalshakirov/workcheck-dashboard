import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL } from "../../App";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    // const [isLoggedIn, setIsloggedIn] = useState(null);
    const navigate = useNavigate();

    // useEffect(() => {
    //     if (isLoggedIn) {
    //         navigate("/", { replace: true });
    //     } else {
    //         navigate("/login", { replace: true });
    //     }
    // }, [isLoggedIn, setIsloggedIn]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        try {
            const response = await axios.post(`${baseURL}/login`, formData, {
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                },
            });

            if (response.status === 200) {
                // setIsloggedIn(true);
                toast.success(response.data.message);
                navigate("/");
                window.location.reload();
            }
        } catch (error) {
            setError(
                error.code === "ERR_NETWORK"
                    ? "Server ishlamayabdi"
                    : error.response.data.error
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "WorkCheck - Tizimga kirish";
    }, []);

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#5f73e2]'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-3'>
                    Tizimga kirish
                </h1>
                {error && (
                    <motion.p
                        initial={{
                            y: 20,
                        }}
                        animate={{
                            y: 0,
                        }}
                        className={`text-red-900 mb-2 text-center p-1 border border-red-400 rounded-lg bg-red-200 ${
                            error
                                ? "opacity-100 pointer-events-auto"
                                : "opacity-0 pointer-events-none"
                        }`}>
                        {error}
                    </motion.p>
                )}
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label
                            className='text-sm font-medium text-gray-700'
                            htmlFor='username'>
                            Username
                        </label>
                        <input
                            id='username'
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className='w-full px-4 py-2 border outline-none transition rounded-lg focus:border-blue-500'
                            autoComplete='username'
                            disabled={loading}
                        />
                    </div>
                    <div className='relative'>
                        <label
                            className='block text-sm font-medium text-gray-700'
                            htmlFor='password'>
                            Parol
                        </label>
                        <input
                            id='password'
                            type={showPassword ? "text" : "password"}
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full px-4 py-2 border outline-none transition rounded-lg focus:border-blue-500'
                            autoComplete='new-password'
                            min='8'
                            max='30'
                            disabled={loading}
                        />
                        <button
                            name='Show password button'
                            aria-label='Show password button'
                            title='Show password'
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute top-8 ml-2 right-3 text-gray-500 hover:text-gray-700'
                            tabIndex={-1}
                            disabled={loading}>
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    <button
                        name='Submit button'
                        aria-label='Submit button'
                        title='Submit'
                        type='submit'
                        className={`w-full bg-blue-400 text-white py-2 rounded-lg transition duration-300 flex items-center justify-center ${
                            loading
                                ? "opacity-60 cursor-not-allowed!"
                                : "hover:bg-blue-600"
                        }`}
                        disabled={loading}>
                        {loading ? (
                            <span className='flex items-center gap-2'>
                                <LoaderCircle className='animate-spin' />
                                Tekshirilmoqda...
                            </span>
                        ) : (
                            "Kirish"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
