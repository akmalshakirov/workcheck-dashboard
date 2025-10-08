import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Modal } from "../../components/ui/Modal/Modal";
import { Button } from "../../components/ui/Button/Button";
import PhoneInput from "../FormatPhone";

type Props = {
    visible: boolean;
    setVisible: (v: boolean) => void;
    initialPhone?: string;
};

type Step = "enterPhone" | "verifyCode" | "setNewPassword" | "done";

export default function ResetPasswordModal({
    visible,
    setVisible,
    initialPhone = "",
}: Props) {
    const [step, setStep] = useState<Step>("enterPhone");
    const [phone, setPhone] = useState(initialPhone);
    const [code, setCode] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorText, setErrorText] = useState<string | null>(null);
    const [attemptsLeft, setAttemptsLeft] = useState(5);

    const activeController = useRef<AbortController | null>(null);

    useEffect(() => {
        if (!visible) resetAll();
        return () => abortActive();
    }, [visible]);

    function abortActive() {
        if (activeController.current) {
            try {
                activeController.current.abort();
            } catch (_) {}
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
        setAttemptsLeft(5);
    }

    function getAxiosErrorMessage(err: any) {
        if (axios.isAxiosError(err)) {
            return (
                err.response?.data?.message ||
                err.response?.data ||
                err.message ||
                "Server xatosi"
            );
        }
        return String(err || "Xatolik");
    }

    async function handleSendPhone() {
        setErrorText(null);
        if (!phone.trim()) {
            setErrorText("Iltimos telefon raqamingizni kiriting.");
            return;
        }

        setLoading(true);
        abortActive();
        activeController.current = new AbortController();
        try {
            await axios.post(
                `${baseURL}/check/phone`,
                { phone },
                {
                    signal: activeController.current.signal,
                    withCredentials: true,
                }
            );
            toast.success("Kod yuborildi — telefoningizni tekshiring.");
            setStep("verifyCode");
        } catch (err) {
            const msg = getAxiosErrorMessage(err);
            if (
                (err as any)?.name === "CanceledError" ||
                (err as any)?.message === "canceled"
            ) {
                toast.info("So‘rov bekor qilindi.");
            } else {
                toast.error(msg);
                setErrorText(msg);
            }
        } finally {
            setLoading(false);
            activeController.current = null;
        }
    }

    async function handleVerifyCode() {
        setErrorText(null);
        if (!/^\d{6}$/.test(code)) {
            setErrorText("Iltimos 6 xonali kodni kiriting.");
            return;
        }
        if (attemptsLeft <= 0) {
            setErrorText("Urinishlar tugadi. Iltimos keyinroq urinib ko‘ring.");
            toast.error("Urinishlar tugadi.");
            return;
        }

        setLoading(true);
        abortActive();
        activeController.current = new AbortController();
        try {
            await axios.post(
                `${baseURL}/verify/code`,
                { phone, code },
                {
                    signal: activeController.current.signal,
                    withCredentials: true,
                }
            );
            toast.success("Kod to‘g‘ri. Endi yangi parol kiriting.");
            setStep("setNewPassword");
        } catch (err) {
            const msg = getAxiosErrorMessage(err);
            setAttemptsLeft((prev) => prev - 1);
            toast.error(msg);
            setErrorText(msg);
        } finally {
            setLoading(false);
            activeController.current = null;
        }
    }

    async function handleSetNewPassword() {
        setErrorText(null);
        if (newPassword.length < 6) {
            setErrorText("Parol kamida 6 ta belgidan iborat bo‘lishi kerak.");
            return;
        }

        setLoading(true);
        abortActive();
        activeController.current = new AbortController();
        try {
            await axios.post(
                `${baseURL}/reset/password`,
                { phone, code, newPassword },
                {
                    signal: activeController.current.signal,
                    withCredentials: true,
                }
            );
            toast.success("Parolingiz yangilandi.");
            setStep("done");
            setTimeout(() => {
                setVisible(false);
                resetAll();
            }, 900);
        } catch (err) {
            const msg = getAxiosErrorMessage(err);
            toast.error(msg);
            setErrorText(msg);
        } finally {
            setLoading(false);
            activeController.current = null;
        }
    }

    return (
        <Modal visible={visible} title='Parolni tiklash' width='40'>
            <div>
                {step === "enterPhone" && (
                    <form onSubmit={handleSendPhone} id='enterPhone'>
                        <p className='text-center text-gray-600 mx-auto mb-3'>
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
                        <Button loading={loading} className='mt-4'>
                            Kodni yuborish
                            {/* {loading ? "Yuborilmoqda..." : "Kod yuborish"} */}
                        </Button>
                    </form>
                )}

                {step === "verifyCode" && (
                    <>
                        <p>
                            Telefon: <strong>{phone}</strong>
                        </p>
                        <p>Kodni kiriting (6 raqam).</p>
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
                        />
                        <div>
                            <button
                                onClick={handleVerifyCode}
                                disabled={loading}>
                                {loading ? "Tekshirilmoqda..." : "Tekshirish"}
                            </button>
                            <button
                                onClick={() => setStep("enterPhone")}
                                disabled={loading}>
                                Ortga
                            </button>
                        </div>
                        <div>Urinishlar: {attemptsLeft}</div>
                    </>
                )}

                {step === "setNewPassword" && (
                    <>
                        <p>Yangi parolingizni kiriting.</p>
                        <input
                            type='password'
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder='Yangi parol'
                            disabled={loading}
                        />
                        <div>
                            <button
                                onClick={handleSetNewPassword}
                                disabled={loading}>
                                {loading ? "Saqlanmoqda..." : "Saqlash"}
                            </button>
                            <button
                                onClick={() => setStep("verifyCode")}
                                disabled={loading}>
                                Ortga
                            </button>
                        </div>
                    </>
                )}

                {step === "done" && (
                    <div>Parolingiz muvaffaqiyatli yangilandi.</div>
                )}

                {errorText && <div>{errorText}</div>}
            </div>
        </Modal>
    );
}
