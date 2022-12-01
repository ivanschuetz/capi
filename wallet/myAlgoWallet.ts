import MyAlgo, { SignedTx } from "@randlabs/myalgo-connect"
import buffer from "buffer"
import { Notification } from "../components/Notification"
import { safe, showError } from "../functions/utils"
import { SetString } from "../type_alias"
import { TxsToSign, Wallet, WalletSignedTx } from "./Wallet"
const { Buffer } = buffer

// Note: the wallet connect and my algo wallets share the same "interface"
export function createMyAlgoWallet(
  notification: Notification,
  setMyAddress: SetString
): Wallet {
  const wallet = new MyAlgo()

  // returns address, if needed for immediate use
  async function connect() {
    safe(notification, async () => {
      const accounts = await wallet.connect()
      const addresses = accounts.map((account) => account.address)

      var selectedAddress = null

      if (addresses.length === 0) {
        throw new Error("Please select an address.")
      } else if (addresses.length > 1) {
        throw new Error("Please select only one address.")
      } else {
        const address = addresses[0]
        setMyAddress(address)
        selectedAddress = address
      }

      return selectedAddress
    })
  }

  async function disconnect() {}

  function onPageLoad() {}

  async function signTxs(toSign: TxsToSign): Promise<WalletSignedTx[]> {
    if (!window.Buffer) window.Buffer = Buffer
    let signedTxs = await wallet.signTransaction(toSign.my_algo)
    return signedTxs.map((t) => toSignedTxForRust(t))
  }

  return {
    id: "myalgo", // just to identify quickly wallet in logs
    connect,
    disconnect,
    onPageLoad,
    signTxs,
  }
}

const toSignedTxForRust = (myAlgoSignedTx: SignedTx): WalletSignedTx => {
  return {
    // Uint8Array -> array (can be parsed to Vec<u8> in Rust)
    blob: Array.from(myAlgoSignedTx.blob),
  }
}
