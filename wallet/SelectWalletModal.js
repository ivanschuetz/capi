import Modal from "../modal/Modal";
import { SelectWallet } from "./SelectWallet";

export const SelectWalletModal = ({ deps, setShowModal }) => {
  return (
    <Modal title={"Choose a wallet"} onCloseClick={() => setShowModal(false)}>
      <SelectWallet deps={deps} closeModal={async () => setShowModal(false)} />
    </Modal>
  );
};
