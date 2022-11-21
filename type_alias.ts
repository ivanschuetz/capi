import { Dispatch, SetStateAction } from "react"

export type Wasm =
  typeof import("/Users/ivanschuetz/dev/repo/github/capi/frontend/next/wasm/wasm")

export type SetBool = (value: boolean) => void
export type SetAnyArr = (value: any[]) => void
export type SetString = (value: string) => void
