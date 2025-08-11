import { Modal } from "../../components/ui/Modal/Modal";

export const AddWorkerModal = ({ worker, isVisible }) => {
    return <>{isVisible && <Modal visible={isVisible}>s</Modal>}</>;
}
