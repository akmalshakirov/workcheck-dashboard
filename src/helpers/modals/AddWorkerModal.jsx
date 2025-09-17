import { Modal } from "../../components/ui/Modal/Modal";

export const AddWorkerModal = ({ worker, isVisible }) => {
    return (
        <>
            {isVisible && (
                <Modal visible={isVisible} width='20'>
                    {worker ?? "worker not found!"}
                </Modal>
            )}
        </>
    );
};
