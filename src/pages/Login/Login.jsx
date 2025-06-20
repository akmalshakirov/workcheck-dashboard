import React, { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        login(username, password);
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#5f73e2]'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
                    Tizimiga kirish
                </h1>
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
                        />
                        <button
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute top-8 ml-2 right-3 text-gray-500 hover:text-gray-700'>
                            {showPassword ? (
                                <AiOutlineEyeInvisible size={20} />
                            ) : (
                                <AiOutlineEye size={20} />
                            )}
                        </button>
                    </div>
                    <button
                        type='submit'
                        className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300'>
                        Kirish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
