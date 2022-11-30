import { useEffect, useState } from "react"
import getConfig from "next/config"
import { safe } from "../functions/utils"
import { Deps } from "../context/AppContext"

const { publicRuntimeConfig } = getConfig()

export const AppVersion = ({ deps }: { deps: Deps }) => {
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
