import { Deps } from "../context/AppContext"
import useScript from "../hooks/useScript"
import { OkCancelModal } from "../modal/OkCancelModal"
import { BuyFundsAssetContent } from "./BuyFundsAssetContent"
import { startBuyCurrencyFlow } from "./controller"

export const BuyFundsAssetModal = ({
  deps,
  amount,
  closeModal,
}: {
  deps: Deps
  amount: string
  closeModal: () => void
}) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js")

  return (
    <OkCancelModal
      title={"Top your account"}
      onCancel={closeModal}
      onSubmit={() => startBuyCurrencyFlow(deps, "USDC", amount, closeModal)}
    >
      <BuyFundsAssetContent />
    </OkCancelModal>
  )
}
