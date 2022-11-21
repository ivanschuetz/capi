import { Deps } from "../context/AppContext"
import Modal from "../modal/Modal"
import { SetBool } from "../type_alias"
import { SelectWallet } from "./SelectWallet"

export const SelectWalletModal = ({
  deps,
  setShowModal,
}: {
  deps: Deps
  setShowModal: SetBool
}) => {
  return (
    <Modal title={"Choose a wallet"} onClose={() => setShowModal(false)}>
      <SelectWallet deps={deps} closeModal={async () => setShowModal(false)} />
    </Modal>
  )
}
