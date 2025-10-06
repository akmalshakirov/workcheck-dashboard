import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { baseURL } from "../../App";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
import PhoneInput from "../FormatPhone";

type TProps = { visible: boolean; setVisible: (e: boolean) => void };
type TModalDetails = {
    verifyShown: boolean;
    verifyCode: string;
    newPasswordShown: boolean;
    newPassword: boolean;
};

const ResetPasswordModal = ({ visible, setVisible }: TProps) => {
    const [phone, setPhone] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [modalDetails, setModalDetails] = useState<TModalDetails>({
        verifyShown: false,
        verifyCode: "",
        newPasswordShown: false,
        newPassword: false,
    });

    const handleChange = (e: React.ChangeEvent<string>) => {
        setPhone(e as any);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as any);

        try {
            const response = await axios.post(
                modalDetails.verifyShown
                    ? `${baseURL}/verify/code`
                    : `${baseURL}/check/phone`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            if (response.status === 200) {
                toast.success(`Tasdiqlash kodingiz: ${response?.data?.code}`, {
                    autoClose: 99999,
                });
                setModalDetails((prev) => ({ ...prev, verifyShown: true }));
            }
        } catch (error: any) {
            toast.error(error?.response?.data?.error || error);
        } finally {
            setLoading(false);
        }
    };

    const handlePasswordSubmit = async (
        e: React.FormEvent<HTMLFormElement>
    ) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.target as any);

        try {
            const response = await axios.post(
                `${baseURL}/reset/password`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
        } catch (error: any) {
            toast.error(error?.response?.data?.error || error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal visible={visible} title='Parolni tiklash' width='40'>
            <p className='text-center text-gray-600 mx-auto mb-3'>
                Telefon raqamingizni kiriting va hisobingizga qaytish uchun
                tasdiqlash kodini yuboramiz.
            </p>
            <form
                onSubmit={
                    modalDetails.verifyShown
                        ? handlePasswordSubmit
                        : handleSubmit
                }
                className='flex flex-col space-y-3'>
                <div>
                    <PhoneInput
                        name='phone'
                        onChange={handleChange}
                        value={phone}
                        placeholder='(99)-999-99-99'
                        label='Telefon raqamingizni kiriting:'
                        required
                        focused
                        disabled={loading}
                        // pattern='[0-9]{6}'
                    />
                </div>
                {modalDetails.verifyShown && (
                    <label>
                        Tasdiqlash kodini kiriting:{" "}
                        <input
                            name='code'
                            value={modalDetails.verifyCode}
                            onChange={(e) =>
                                setModalDetails((prev) => ({
                                    ...prev,
                                    verifyCode: e.target.value,
                                }))
                            }
                            type='text'
                            min={6}
                            minLength={6}
                            max={6}
                            maxLength={6}
                            required
                            aria-required
                            disabled={loading}
                            autoFocus={modalDetails.verifyShown}
                            className='focus:border-blue-400 dark:border-gray-600 disabled:opacity-50 disabled:cursor-not-allowed px-3 py-2 duration-150 border border-gray-500/70 rounded-lg outline-none focus:ring-blue-400 focus:ring-1 transition w-full my-1'
                            title='Faqatgina tasdiqlash kodini kiriting!'
                            aria-label='Faqatgina tasdiqlash kodini kiriting!'
                            pattern='[0-9]{6}'
                        />
                    </label>
                )}
                <div className='flex items-center justify-end gap-4 mt-2'>
                    {!loading && (
                        <Button
                            type='button'
                            variant='danger'
                            onClick={() => setVisible(false)}>
                            Bekor qilish
                        </Button>
                    )}
                    <Button type='submit' loading={loading}>
                        Tasdiqlash
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default ResetPasswordModal;
