import MyAlgo from "@randlabs/myalgo-connect"
import buffer from "buffer"
import { Notification } from "../components/Notification"
import { SetString } from "../type_alias"
const { Buffer } = buffer

// Note: the wallet connect and my algo wallets share the same "interface"
export function createMyAlgoWallet(
  notification: Notification,
  setMyAddress: SetString
) {
  const wallet = new MyAlgo()

  // returns address, if needed for immediate use
  async function connect() {
    try {
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
    } catch (e) {
      notification.error(e)
    }
  }

  function disconnect() {}

  function onPageLoad() {}

  async function signTxs(toSign) {
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

const toSignedTxForRust = (myAlgoSignedTx) => {
  return {
    // Uint8Array -> array (can be parsed to Vec<u8> in Rust)
    blob: Array.from(myAlgoSignedTx.blob),
  }
}
