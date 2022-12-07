import { useEffect, useState } from "react"
import { Deps } from "../context/AppContext"
import { retrieveProfits } from "../functions/shared"
import { safe, showError } from "../functions/utils"
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
import Progress from "./Progress"
import { SubmitButton } from "./SubmitButton"

export const MyAccount = ({ deps, daoId }: { deps: Deps; daoId?: string }) => {
  const [showSelectWalletModal, setShowSelectWalletModal] = useState(false)

  const [showDisclaimerModal, setShowDisclaimerModal] = useState(false)

  return (
    <div className="my-account-container">
      <div className="d-flex justify-between">
        <div className="text">Wallet</div>
      </div>
      <div className="my-address">
        <MyAddressSection deps={deps} daoId={daoId} />
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

const MyAddressSection = ({ deps, daoId }: { deps: Deps; daoId?: string }) => {
  if (deps.myAddress !== "") {
    return (
      <div id="user_data">
        <div className="my_address">
          <div>
            <MyAddress deps={deps} />
          </div>
          {deps.myBalance && <MyBalanceAndDisconnect deps={deps} />}
        </div>
        {daoId && <DividendSection deps={deps} daoId={daoId} />}
      </div>
    )
  } else {
    return null
  }
}

const MyBalanceAndDisconnect = ({ deps }: { deps: Deps }) => {
  return (
    <div id="my_account_my_balance__balance">
      <img className="s-16 mr-10" src={funds.src} alt="funds" />
      <div>{deps.myBalance.balance_funds_asset}</div>
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
          className="grey-190"
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

const DividendSection = ({ deps, daoId }: { deps: Deps; daoId?: string }) => {
  updateInvestmentData(deps, daoId)

  if (deps.myDividend) {
    return (
      <div className="d-flex flex-column">
        <ClaimableDividend dividend={deps.myDividend} />
        <div className="d-flex w-100 justify-center">
          <SubmitClaimButton deps={deps} daoId={daoId} />
        </div>
      </div>
    )
  } else if (daoId) {
    // we're on a dao page: waiting for dividend to be fetched
    return <Progress />
  } else {
    return null
  }
}

const ClaimableDividend = ({ dividend }: { dividend: string }) => {
  return (
    <div className="desc d-flex align-center mb-32 justify-between">
      {"Claimable dividend: "}
      <div className="d-flex align-center mr-26 gap-10">
        <img className="s-16" src={funds.src} alt="funds" />
        {dividend}
      </div>
    </div>
  )
}

const SubmitClaimButton = ({ deps, daoId }: { deps: Deps; daoId: string }) => {
  const [submitting, setSubmitting] = useState(false)

  return (
    <SubmitButton
      label={"Claim"}
      isLoading={submitting}
      disabled={deps.investmentData?.investor_claimable_dividend === "0"}
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
