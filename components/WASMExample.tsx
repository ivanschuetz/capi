import { useContext, useEffect, useState } from "react"
import { WASMContext } from "../context/WASMContext"

// TODO decide whether we'll use context or not for wasm and delete this and adjust everywhere rest if needed
export const WASMExample = () => {
  const [version, setVersion] = useState("...")

  const ctx = useContext(WASMContext)

  useEffect(() => {
    const getVersion = async () => {
      if (ctx.wasm) {
        const v = await ctx.wasm.wasmVersion()
        console.log("version: %o", v)
        setVersion(v)
      }
    }
    getVersion()
  }, [ctx.wasm])

  return <div>{"WASM version: " + version}</div>
}
