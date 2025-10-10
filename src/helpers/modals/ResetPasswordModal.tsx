import axios from "axios";
import { Eye, EyeOff } from "lucide-react";
import { FormEvent, useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
import PhoneInput from "../FormatPhone";

type TPageProps = {
    visible: boolean;
    setVisible: (v: boolean) => void;
    initialPhone?: string;
};

type Step = "enterPhone" | "verifyCode" | "setNewPassword" | "done";

export default function ResetPasswordModal({
    visible,
    setVisible,
    initialPhone = "",
}: TPageProps) {
    const [step, setStep] = useState<Step>("enterPhone");
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [phone, setPhone] = useState(initialPhone);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);

    const activeController = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!visible) resetAll();
        return () => abortActive();
    }, [visible]);

    function abortActive() {
        if (activeController.current) {
            try {
                activeController.current.abort();
            } catch {}
            activeController.current = null;
        }
    }

    function resetAll() {
        abortActive();
        setStep("enterPhone");
        setPhone(initialPhone);
        setCode("");
        setNewPassword("");
        setLoading(false);
        setErrorText(null);
    }

    async function handleSendPhone(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrorText(null);

        abortActive();
        activeController.current = new AbortController();
        try {
            const response = await axios.post(
                `${baseURL}/check/phone`,
                { phone },
                {
                    signal: activeController.current.signal,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(response.data.code, {
                autoClose: 88888,
            });
            setStep("verifyCode");
        } catch (error: any) {
            toast.error(error?.response?.data?.error || error.name || error);
        } finally {
            setLoading(false);
            activeController.current = null;
        }
    }

    async function handleVerifyCode(e: FormEvent) {
        e.preventDefault();
        setLoading(true);
        setErrorText(null);

        const formData = new FormData(e.target as any);
        formData.append("phone", phone);

        abortActive();
        activeController.current = new AbortController();
        try {
            const response = await axios.post(
                `${baseURL}/verify/code`,
                formData,
                {
                    signal: activeController.current.signal,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            toast.success(response.data);
            setStep("setNewPassword");
        } catch (error: any) {
            toast.error(error?.response?.data?.error || error.name || error);
        } finally {
            setLoading(false);
            activeController.current = null;
        }
    }

    async function handleSetNewPassword(e: FormEvent) {
        e.preventDefault();
        setErrorText(null);

        setLoading(true);
        abortActive();
        activeController.current = new AbortController();
        try {
            const { data } = await axios.post(
                `${baseURL}/reset/password`,
                { password: newPassword, phone },
                {
                    signal: activeController.current.signal,
                }
            );
            toast.success(data.message);
            setStep("done");
            setVisible(false);
            resetAll();
        } catch (error: any) {
            toast.error(error?.response?.data?.error || error.name || error);
        } finally {
            setLoading(false);
            activeController.current = null;
        }
    }

    return (
        <Modal visible={visible} title='Parolni tiklash' width='30'>
            <div>
                {step === "enterPhone" && (
                    <form onSubmit={handleSendPhone} id='enterPhone'>
                        <p className='text-center text-gray-600 mb-4'>
                            Telefon raqamingizni kiriting va hisobingizga
                            qaytish uchun tasdiqlash kodini yuboramiz.
                        </p>
                        <PhoneInput
                            onChange={(e) => setPhone(e)}
                            value={phone}
                            disabled={loading}
                            focused={true}
                            required
                            name='phone'
                        />
                        <div className='flex items-center justify-end mt-4 gap-2'>
                            {!loading && (
                                <Button
                                    type='reset'
                                    variant='danger'
                                    onClick={() => setVisible(false)}>
                                    Yopish
                                </Button>
                            )}
                            <Button loading={loading}>Kodni yuborish</Button>
                        </div>
                    </form>
                )}

                {step === "verifyCode" && (
                    <form onSubmit={handleVerifyCode} id='verifyCode'>
                        <p className='text-center mb-4 text-gray-600'>
                            Tasdiqlash kodi yuborilgan telefon:{" "}
                            <strong>{phone}</strong>
                        </p>
                        <input
                            value={code}
                            onChange={(e) =>
                                setCode(
                                    e.target.value
                                        .replace(/\D/g, "")
                                        .slice(0, 6)
                                )
                            }
                            placeholder='123456'
                            inputMode='numeric'
                            disabled={loading}
                            className='text-base focus:border-blue-400 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 duration-150 border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 w-full transition'
                            required
                            aria-required
                            title='Tasdiqlash kodi (6 raqamli)'
                            autoFocus
                            name='code'
                        />
                        <div className='flex items-center gap-2 justify-end mt-4'>
                            {!loading && (
                                <Button
                                    variant='danger'
                                    type='button'
                                    onClick={() => setStep("enterPhone")}>
                                    Ortga
                                </Button>
                            )}
                            <Button type='submit' loading={loading}>
                                Tekshirish
                            </Button>
                        </div>
                    </form>
                )}

                {step === "setNewPassword" && (
                    <form onSubmit={handleSetNewPassword}>
                        <p className='text-center text-gray-600 mb-4'>
                            Yangi parolingizni kiriting.
                        </p>
                        <div className='relative'>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder='Yangi parol'
                                disabled={loading}
                                autoFocus
                                required
                                aria-required
                                min={8}
                                minLength={8}
                                max={20}
                                maxLength={20}
                                name='password'
                                autoComplete='new-password'
                                title='Yangi parolingizni kiriting'
                                className='text-base disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 duration-150 border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 w-full transition'
                            />
                            <button
                                name='Show password button'
                                aria-label='Show password button'
                                title='Show password'
                                type='button'
                                onClick={() => setShowPassword(!showPassword)}
                                className='absolute top-1/2 -translate-y-1/2 right-2 text-gray-500 hover:text-gray-700'
                                tabIndex={-1}
                                disabled={loading}>
                                {!showPassword ? (
                                    <EyeOff size={20} />
                                ) : (
                                    <Eye size={20} />
                                )}
                            </button>
                        </div>
                        <div className='flex items-center justify-end gap-2 mt-4'>
                            {!loading && (
                                <Button
                                    type='button'
                                    variant='danger'
                                    onClick={() => setStep("verifyCode")}
                                    loading={loading}>
                                    Ortga
                                </Button>
                            )}
                            <Button type='submit' loading={loading}>
                                Saqlash
                            </Button>
                        </div>
                    </form>
                )}

                {step === "done" && (
                    <div>Parolingiz muvaffaqiyatli yangilandi.</div>
                )}

                {errorText && <div>{errorText}</div>}
            </div>
        </Modal>
    );
}
