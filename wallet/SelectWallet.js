import { SubmitButton } from "../components/SubmitButton"
import { createMyAlgoWallet } from "./myAlgoWallet"
import { createWcWallet } from "./walletConnectWallet"

export const SelectWallet = ({ deps, closeModal }) => {
  return (
    <div className="d-flex flex-column align-center">
      <SubmitButton
        label={"Wallet Connect"}
        className="button-primary w-300px mb-24"
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
        className="button-primary w-300px"
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

const selectWallet = async (deps, wallet, closeModal) => {
  deps.setWallet(wallet)

  await wallet.connect()
  closeModal()
}
