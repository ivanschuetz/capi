import { Address } from "algosdk";
import { to } from "../infra/newtype";
import { SharesPercentage } from "./SharesPercentage";

/** Capi asset environment relevant to the DAOs */
export type CapiAssetDaoDeps = {
  // Shares percentage is slightly wrong semantically: we just want a [0..1] percentage. For now repurposing.
  escrow_percentage: SharesPercentage;
  address: CapiAddress;
};

export type CapiAddress = {
  value: Address;
  readonly __tag: unique symbol;
};

export const toCapiAddress = (value: Address): CapiAddress => {
  return to<CapiAddress>(value);
};
