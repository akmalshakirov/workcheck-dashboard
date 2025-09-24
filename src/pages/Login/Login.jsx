import axios from "axios";
import { motion } from "framer-motion";
import { Eye, EyeOff, LoaderCircleIcon, LogIn } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Button } from "../../components/ui/Button/Button";

const Login = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

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
                localStorage.setItem("token", response.data.token);
                toast.success(response.data.message);
                navigate("/");
            }
        } catch (error) {
            if (error.code === "ERR_NETWORK") {
                setError("Server bilan aloqa yo'q!");
            }
            setError(error.response.data.error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        document.title = "WorkCheck - Tizimga kirish";
    }, []);

    return (
        <div className='flex items-center justify-center min-h-screen bg-[#5f73e2] max-md:px-5 max-sm:px-5'>
            <div className='w-full max-w-md bg-white rounded-lg shadow-lg p-6'>
                <h1 className='text-2xl max-sm:text-md font-bold text-center text-gray-800 mb-3'>
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
                <form
                    onSubmit={handleSubmit}
                    className='space-y-5 max-md:space-y-3 max-sm:space-y-2'>
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
                            className='border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 px-4 py-2 mt-2 transition disabled:opacity-50 w-full'
                            autoComplete='username'
                            minLength={3}
                            maxLength={15}
                            disabled={loading}
                            autoFocus
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
                            className='border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 px-4 py-2 mt-2 transition disabled:opacity-50 w-full'
                            autoComplete='new-password'
                            minLength={8}
                            maxLength={15}
                            disabled={loading}
                        />
                        <button
                            name='Show password button'
                            aria-label='Show password button'
                            title='Show password'
                            type='button'
                            onClick={() => setShowPassword(!showPassword)}
                            className='absolute top-1/2 mt-1 right-2 text-gray-500 hover:text-gray-700'
                            tabIndex={-1}
                            disabled={loading}>
                            {showPassword ? (
                                <EyeOff size={20} />
                            ) : (
                                <Eye size={20} />
                            )}
                        </button>
                    </div>
                    <div>
                        {loading ? (
                            <span
                                className={`flex items-center justify-center bg-blue-400 text-white py-2 rounded-lg transition duration-300 ${
                                    loading
                                        ? "opacity-60 cursor-not-allowed select-none"
                                        : "hover:bg-blue-600"
                                }`}>
                                <LoaderCircleIcon
                                    className='animate-spin'
                                    size={24}
                                />
                            </span>
                        ) : (
                            <>
                                <Button
                                    name='Submit button'
                                    aria-label='Submit button'
                                    title='Submit'
                                    type='submit'
                                    loading={loading}
                                    fullWidth
                                    className='py-2'
                                    leftIcon={<LogIn />}>
                                    Kirish
                                </Button>
                            </>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;
