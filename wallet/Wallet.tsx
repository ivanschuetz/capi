export type Wallet = {
  id: string
  connect: () => void
  disconnect: () => void
  onPageLoad: () => void
  signTxs: (txs: any) => void
}
