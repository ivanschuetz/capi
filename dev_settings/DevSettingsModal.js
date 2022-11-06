import Modal from "../modal/Modal";
import { DevSettings } from "./DevSettings";

export const DevSettingsModal = ({ closeModal }) => {
  return (
    <Modal title={"Dev settings"} onClose={() => closeModal()}>
      <DevSettings closeModal={closeModal} />
    </Modal>
  );
};
