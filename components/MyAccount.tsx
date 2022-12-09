import { useEffect, useState } from "react"
import { Deps } from "../context/AppContext"
import { retrieveProfits } from "../functions/shared"
import { safe } from "../functions/utils"
import funds from "../images/funds.svg"
import arrow from "../images/svg/arrow-right.svg"
import { DisclaimerModal } from "../modal/DisclaimerModal"
import Modal from "../modal/Modal"
import {
  needsToAcceptDisclaimer,
  saveAcceptedDisclaimer,
} from "../modal/storage"
import { SetBool } from "../type_alias"
import { SelectWallet } from "../wallet/SelectWallet"
import { CopyPasteHtml } from "./CopyPastText"
import { SubmitButton } from "./SubmitButton"

export const MyAccount = ({ deps, daoId }: { deps: Deps; daoId?: string }) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false)

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)

  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text-60 font-semibold text-te">{"Wallet"}</div>
      </div>
      <div className="w-full sm:w-1/2 md:w-auto">
        <MyData deps={deps} daoId={daoId} />
        {maybeConnectButton(
          deps,
          setShowSelectWalletModal,
          setShowDisclaimerModal
        )}
      </div>
      {showSelectWalletModal && (
        <Modal
          title={"Choose a wallet"}
          onClose={() => setShowSelectWalletModal(false)}
        >
          <SelectWallet
            deps={deps}
            closeModal={() => setShowSelectWalletModal(false)}
          />
        </Modal>
      )}
      {showDisclaimerModal && (
        <DisclaimerModal
          closeModal={() => setShowDisclaimerModal(false)}
          onAccept={() => {
            saveAcceptedDisclaimer()
            setShowDisclaimerModal(false)
            // continue to select wallet: assumes that the disclaimer here is (only) shown when clicking on connect wallet
            setShowSelectWalletModal(true)
          }}
        />
      )}
    </div>
  )
}

const MyData = ({ deps, daoId }: { deps: Deps; daoId?: string }) => {
  if (deps.myAddress !== "") {
    return (
      <div>
        <div className="mb-8 flex flex-row justify-between">
          <MyDataColumn>
            <MyAddress deps={deps} />
            <DividendLabel />
          </MyDataColumn>
          <MyDataColumn>
            {deps.myBalance && <MyBalanceAndDisconnect deps={deps} />}
            <DividendAmount dividend={deps.myDividend} />
          </MyDataColumn>
        </div>
        <SubmitClaimButton deps={deps} daoId={daoId} />
      </div>
    )
  } else {
    return null
  }
}

const MyDataColumn = ({ children }: { children: React.ReactNode }) => {
  return <div className="flex flex-col justify-between gap-6">{children}</div>
}

const MyBalanceAndDisconnect = ({ deps }: { deps: Deps }) => {
  return (
    <div id="my_account_my_balance__balance">
      <img className="s-16 mr-3" src={funds.src} alt="funds" />
      <div className="mr-4 text-45 font-semibold text-te">
        {deps.myBalance.balance_funds_asset}
      </div>
      <img
        className="arrow"
        src={arrow.src}
        alt="arrow"
        onClick={async () => await disconnect(deps)}
      />
    </div>
  )
}

const MyAddress = ({ deps }: { deps: Deps }) => {
  return (
    <CopyPasteHtml
      element={
        <a
          href={"https://testnet.algoexplorer.io/address/" + deps.myAddress}
          target="_blank"
          rel="noreferrer"
          className="text-50 font-medium text-ne4"
        >
          {deps.myAddressDisplay}
        </a>
      }
      copyText={deps.myAddress}
      notification={deps.notification}
      copyMsg={"Address copied to clipboard"}
    />
  )
}

const DividendLabel = () => {
  return (
    <div className="text-50 font-bold text-te">{"Claimable dividend: "}</div>
  )
}

const DividendAmount = ({ dividend }: { dividend: string }) => {
  return (
    <div className="mr-6 flex items-center gap-3 text-50 font-bold text-te">
      <img className="h-4 w-4" src={funds.src} alt="funds" />
      {dividend}
    </div>
  )
}

const SubmitClaimButton = ({ deps, daoId }: { deps: Deps; daoId: string }) => {
  const [submitting, setSubmitting] = useState(false)

  return (
    <SubmitButton
      label={"Claim"}
      isLoading={submitting}
      // TODO return has dividend or unformatted 0 from wasm and check against that
      disabled={deps.myDividend === "0.00"}
      fullWidth={true}
      onClick={async () => {
        if (!deps.wasm) {
          // ignoring this seems reasonable, wasm file should be normally loaded before user can interact
          console.error("Click before wasm is ready: ignored")
          return
        }
        await retrieveProfits(
          deps.wasm,
          deps.myAddress,
          setSubmitting,
          deps.notification,
          deps.updateMyBalance,
          daoId,
          deps.updateInvestmentData,
          deps.updateFunds,
          deps.updateMyDividend,
          deps.wallet
        )
      }}
    />
  )
}

const maybeConnectButton = (
  deps: Deps,
  setShowSelectWalletModal: SetBool,
  setShowDisclaimerModal: SetBool
) => {
  if (deps.myAddress === "") {
    return (
      <ConnectButton
        setShowSelectWalletModal={setShowSelectWalletModal}
        setShowDisclaimerModal={setShowDisclaimerModal}
      />
    )
  } else {
    return null
  }
}

const ConnectButton = ({
  setShowSelectWalletModal,
  setShowDisclaimerModal,
}: {
  setShowSelectWalletModal: SetBool
  setShowDisclaimerModal: SetBool
}) => {
  return (
    <SubmitButton
      label={"Connect wallet"}
      onClick={async () => {
        if (await needsToAcceptDisclaimer()) {
          setShowDisclaimerModal(true)
        } else {
          setShowSelectWalletModal(true)
        }
      }}
    />
  )
}

const disconnect = async (deps: Deps) => {
  safe(deps.notification, async () => {
    await deps.wallet.disconnect()
    deps.setMyAddress("")
  })
}

const updateInvestmentData = (deps: Deps, daoId: string) => {
  useEffect(() => {
    ;(async () => {
      if (deps.myAddress) {
        await deps.updateInvestmentData.call(null, daoId, deps.myAddress)
      }
    })()
  }, [deps.notification, deps.myAddress, daoId, deps.updateInvestmentData])
}
