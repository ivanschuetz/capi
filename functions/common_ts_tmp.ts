// TODO port common to ts and merge with this

import { InitOutput } from "wasm";

// TODO how to get rid of the warning when awaiting the wasm functions (after this is called),
// InitOutput's function declarations are not async. Are we using this incorrectly? check bindgen docs
// TODO type any: if we inline this code, default() navigates to wasm.d.ts - how do we type this (it should navigate from here too)?
export const ready = async (wasmPromise: any): Promise<InitOutput> => {
  const wasm = await wasmPromise;
  await wasm.default();
  return wasm;
};
