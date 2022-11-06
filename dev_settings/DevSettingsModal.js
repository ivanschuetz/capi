import Modal from "../modal/Modal";
import { DevSettings } from "./DevSettings";

export const DevSettingsModal = ({ closeModal }) => {
  return (
    <Modal title={"Dev settings"} onCloseClick={() => closeModal()}>
      <DevSettings closeModal={closeModal} />
    </Modal>
  );
};
