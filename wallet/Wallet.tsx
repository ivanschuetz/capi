export type Wallet = {
  id: string
  connect: () => void
  disconnect: () => void
  onPageLoad: () => void
  signTxs: (txs: TxsToSign) => void
}

export type TxsToSign = {
  my_algo: MyAlgoTx[]
  wc: WcTx[]
}

// Transaction format expected by MyAlgo
// Marker type - we only pass the object through from Rust to MyAlgo
export type MyAlgoTx = any

// Transaction format expected by wallet connect
// Marker type - we only pass the object through from Rust to MyAlgo
export type WcTx = any
