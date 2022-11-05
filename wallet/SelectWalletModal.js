import Modal from "../modal/modal";
import { SelectWallet } from "./SelectWallet";

export const SelectWalletModal = ({ deps, setShowModal }) => {
  return (
    <Modal title={"Choose a wallet"} onClose={() => setShowModal(false)}>
      <SelectWallet deps={deps} closeModal={async () => setShowModal(false)} />
    </Modal>
  );
};
