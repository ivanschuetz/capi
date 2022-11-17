import { ReactNode, useEffect, useRef, useState } from "react";
import { createContext } from "react";
import useEffectOnce from "../hooks/useEffectOnce";

const initial: IWASMContext = {};

export const WASMContext = createContext(initial);

// TODO decide whether we'll use context or not for wasm and adjust everywhere rest if needed
export const WASMContextProvider: React.FC<WASMContextProviderProps> = ({
  children,
}) => {
  const [state, setState] = useState<IWASMContext>(initial);

  // note: it's important to run this really only once (react has a strict mode which makes it run twice in dev mode),
  // otherwise there can be race conditions that crash the app, see https://github.com/rustwasm/wasm-bindgen/issues/3153
  useEffectOnce(() => {
    (async () => {
      const wasm = await import("wasm");
      await wasm.default();
      setState({ wasm });
    })();
  });

  return <WASMContext.Provider value={state}>{children}</WASMContext.Provider>;
};

interface IWASMContext {
  wasm?: typeof import("wasm");
}

interface WASMContextProviderProps {
  children: ReactNode;
}
