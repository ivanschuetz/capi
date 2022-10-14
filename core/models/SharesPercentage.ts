import { to } from "../infra/newtype";

export type SharesPercentage = {
  value: number;
  readonly __tag: unique symbol;
};

export const toSharePercentage = (value: number): SharesPercentage => {
  return to<SharesPercentage>(value);
};
