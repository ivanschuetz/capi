import { to } from "../infra/newtype";

export type AppId = {
  value: number;
  readonly __tag: unique symbol;
};

export const toAppId = (value: number): AppId => {
  return to<AppId>(value);
};

export type FundsAsset = {
  value: number;
  readonly __tag: unique symbol;
};

export const toFundsAsset = (value: number): FundsAsset => {
  return to<FundsAsset>(value);
};
