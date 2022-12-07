import { SubmitButton } from "../components/SubmitButton"
import { Deps } from "../context/AppContext"
import { createMyAlgoWallet } from "./myAlgoWallet"
import { Wallet } from "./Wallet"
import { createWcWallet } from "./walletConnectWallet"

export const SelectWallet = ({
  deps,
  closeModal,
}: {
  deps: Deps
  closeModal: () => void
}) => {
  return (
    <div className="d-flex flex-column align-center">
      <SubmitButton
        label={"Wallet Connect"}
        onClick={async () =>
          selectWallet(
            deps,
            createWcWallet(
              deps.notification,
              deps.setMyAddress,
              deps.setWcShowOpenWalletModal
            ),
            closeModal
          )
        }
      />
      <SubmitButton
        label={"My Algo"}
        onClick={async () =>
          selectWallet(
            deps,
            createMyAlgoWallet(deps.notification, deps.setMyAddress),
            closeModal
          )
        }
      />
    </div>
  )
}

const selectWallet = async (
  deps: Deps,
  wallet: Wallet,
  closeModal: () => void
) => {
  deps.setWallet(wallet)

  await wallet.connect()
  closeModal()
}
