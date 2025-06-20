import React, { useState } from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { useAuth } from "../../hooks/useAuth";

const Login = () => {
    const { login } = useAuth();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    // const [loading, setLoading] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        // setLoading(true);
        login(username, password);
    };

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#5f73e2]'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
                <h1 className='text-2xl font-bold text-center text-gray-800 mb-6'>
                    WorkCheck tizimiga kirish
                </h1>
                <form onSubmit={handleSubmit} className='space-y-5'>
                    <div>
                        <label
                            className='block text-sm font-medium text-gray-700'
                            htmlFor='username'>
                            Uzerneym
                        </label>
                        <input
                            id='username'
                            type='text'
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            autoComplete='username'
                        />
                    </div>
                    <div>
                        <label
                            className='block text-sm font-medium text-gray-700'
                            htmlFor='password'>
                            Parol
                        </label>
                        <input
                            id='password'
                            type='password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className='w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
                            autoComplete='new-password'
                        />
                    </div>
                    <button
                        // disabled={loading}
                        type='submit'
                        className='w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300'>
                        {/* {loading ? (
                            <>
                                <AiOutlineLoading3Quarters />
                            </>
                        ) : (
                            "Kirish"
                        )} */}
                        Kirish
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;
