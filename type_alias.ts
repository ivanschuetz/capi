import { Dispatch, SetStateAction } from "react"

export type Wasm =
  typeof import("/Users/ivanschuetz/dev/repo/github/capi/frontend/next/wasm/wasm")

export type SetBool = Dispatch<SetStateAction<boolean>>
export type SetAnyArr = Dispatch<SetStateAction<any[]>>
export type SetString = Dispatch<SetStateAction<string>>
