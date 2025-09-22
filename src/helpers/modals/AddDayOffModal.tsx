import { FormEvent, useState } from "react";
import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";
import { useTranslation } from "react-i18next";

type AddDayOffProps = {
    visible: boolean;
    setVisible: (v: boolean) => void;
    modalTitle: string;
};

const AddDayOffModal = ({
    visible,
    setVisible,
    modalTitle,
}: AddDayOffProps) => {
    const { t } = useTranslation();
    const [addDayOffLoading, setDayOffLoading] = useState(false);
    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setDayOffLoading(true);
        setTimeout(() => {
            setVisible(false);
            setDayOffLoading(false);
        }, 7777);
    };
    return (
        <Modal visible={visible} title={modalTitle} width='50'>
            <form onSubmit={handleSubmit}>
                <label className='flex items-center gap-2'>
                    {t("add_day_off_name")}:
                    <input
                        type='text'
                        className='border border-gray-500/70 text-sm rounded-lg outline-none focus:ring-blue-400 focus:ring-1 p-2 transition disabled:opacity-50'
                        minLength={3}
                        maxLength={20}
                        name='day-off-name'
                        required
                        aria-required
                        disabled={addDayOffLoading}
                        title={t("add_day_off_name")}
                    />
                </label>
                <div></div>
                <div className='flex justify-end gap-2 mt-2'>
                    {!addDayOffLoading && (
                        <Button
                            variant='danger'
                            onClick={() => setVisible(false)}
                            type='reset'>
                            {t("cancel")}
                        </Button>
                    )}
                    <Button type='submit' loading={addDayOffLoading}>
                        {addDayOffLoading ? t("sending") : t("ok")}
                    </Button>
                </div>
            </form>
        </Modal>
    );
};

export default AddDayOffModal;
