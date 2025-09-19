import { Button } from "../../components/ui/Button/Button";
import { Modal } from "../../components/ui/Modal/Modal";

type AddDayOffProps = { visible: boolean; setVisible: (v: boolean) => void };

const AddDayOff = ({ visible, setVisible }: AddDayOffProps) => {
    return (
        <Modal visible={visible}>
            <h1>Xellooo</h1>
            <Button size='xl' onClick={() => setVisible(false)}>
                OK
            </Button>
        </Modal>
    );
};

export default AddDayOff;
