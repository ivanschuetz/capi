import useScript from "../hooks/useScript"
import { OkCancelModal } from "../modal/OkCancelModal"
import { BuyAlgosContent } from "./BuyAlgosContent"
import { startBuyCurrencyFlow } from "./controller"

export const BuyAlgosModal = ({ deps, closeModal }) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js")

  return (
    <OkCancelModal
      title={"Top your account"}
      closeModal={closeModal}
      onSubmit={() => startBuyCurrencyFlow(deps, "ALGO", "1", closeModal)}
    >
      <BuyAlgosContent />
    </OkCancelModal>
  )
}
