import { Eye, EyeOff, LoaderCircle } from "lucide-react";
import React, { useState } from "react";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await login(username, password);
        } catch (err) {
            setError("Login yoki parol noto'g'ri yoki serverda xatolik.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#5f73e2]'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
                    Tizimga kirish
                </h1>
                {error && (
                    <div className='mb-4 text-red-600 text-center font-medium'>
                        {error}
                    </div>
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
                            disabled={loading}
                        />
                        <button
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
                        type='submit'
                        className={`w-full bg-blue-500 text-white py-2 rounded-lg transition duration-300 flex items-center justify-center ${
                            loading
                                ? "opacity-60 cursor-not-allowed"
                                : "hover:bg-blue-600"
                        }`}
                        disabled={loading}>
                        {loading ? (
                            <span className='flex items-center gap-2'>
                                <LoaderCircle className='animate-spin' />
                                Yuklanmoqda...
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
