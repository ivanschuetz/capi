import useScript from "../common_hooks/useScript";
import { OkCancelModal } from "../modal/OkCancelModal";
import { BuyFundsAssetContent } from "./BuyFundsAssetContent";
import { startBuyCurrencyFlow } from "./controller";

export const BuyFundsAssetModal = ({ deps, amount, closeModal }) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js");

  return (
    <OkCancelModal
      title={"Top your account"}
      closeModal={closeModal}
      onSubmit={() => startBuyCurrencyFlow(deps, "USDC", amount, closeModal)}
    >
      <BuyFundsAssetContent />
    </OkCancelModal>
  );
};
