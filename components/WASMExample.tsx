import { useContext, useEffect, useState } from "react";
import { WASMContext } from "../context/WASM";

export const WASMExample = () => {
  const [version, setVersion] = useState("...");

  const ctx = useContext(WASMContext);

  useEffect(() => {
    const getVersion = async () => {
      if (ctx.wasm) {
        const v = await ctx.wasm.bridge_wasm_version();
        console.log("version: %o", v);
        setVersion(v);
      }
    };
    getVersion();
  }, [ctx.wasm]);

  return <div>{"WASM version: " + version}</div>;
};
