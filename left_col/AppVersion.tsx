import { useEffect, useState } from "react"
import getConfig from "next/config"
import { safe } from "../functions/utils"

const { publicRuntimeConfig } = getConfig()

export const AppVersion = ({ deps }) => {
  const [wasmVersion, setWasmVersion] = useState(null)

  useEffect(() => {
    if (deps.wasm) {
      safe(deps.notification, async () => {
        setWasmVersion(await deps.wasm.wasmVersion())
      })
    }
  }, [deps.wasm, deps.notification])

  return (
    <div>{"Version: " + publicRuntimeConfig?.version + "::" + wasmVersion}</div>
  )
}
