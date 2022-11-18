import { useEffect, useState } from "react";
import { getWasmVersion } from "../controller/app";
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

export const AppVersion = ({ deps }) => {
  const [wasmVersion, setWasmVersion] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      if (deps.wasm) {
        getWasmVersion(deps.wasm, deps.statusMsg, setWasmVersion);
      }
    }
    asyncInit();
  }, [deps.wasm, deps.statusMsg]);

  return (
    <div>
      {"Version: " + publicRuntimeConfig?.version + "::" + wasmVersion}
    </div>
  );
};
