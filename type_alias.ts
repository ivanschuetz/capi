import { Dispatch, SetStateAction } from "react"
import { Wallet } from "./wallet/Wallet"

export type Wasm =
  typeof import("/Users/ivanschuetz/dev/repo/github/capi/frontend/next/wasm/wasm")

export type SetBool = (value: boolean) => void
export type SetAnyArr = (value: any[]) => void
export type SetString = (value: string) => void
export type SetStringOpt = (value: string | null) => void
export type SetWallet = (value: Wallet) => void
