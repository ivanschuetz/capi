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

export type Timestamp = {
  value: number;
  readonly __tag: unique symbol;
};

export const toTimestamp = (value: number): Timestamp => {
  return to<Timestamp>(value);
};

export type FundsAmount = {
  value: number;
  readonly __tag: unique symbol;
};

export const toFundsAmount = (value: number): FundsAmount => {
  return to<FundsAmount>(value);
};

export type ShareAmount = {
  value: number;
  readonly __tag: unique symbol;
};

export const toShareAmount = (value: number): ShareAmount => {
  return to<ShareAmount>(value);
};

export type Integer = {
  value: number; // later we might extend this (and the factory parameter) with `| bigint`
  readonly __tag: unique symbol;
};

export const toInteger = (value: number): Integer => {
  if (!Number.isInteger(value)) {
    throw new Error(`Number: ${value} is not an integer`);
  }
  return to<Integer>(value);
};

export type TealSourceTemplate = {
  value: Uint8Array;
  readonly __tag: unique symbol;
};

export const toTealSourceTemplate = (value: Uint8Array): TealSourceTemplate => {
  return to<TealSourceTemplate>(value);
};

export type VersionedTealSourceTemplate = {
  version: Integer;
  template: TealSourceTemplate;
};

export type TealSource = {
  value: Uint8Array;
  readonly __tag: unique symbol;
};

export const toTealSource = (value: Uint8Array): TealSource => {
  return to<TealSource>(value);
};

export type CompiledTeal = {
  value: Uint8Array;
  readonly __tag: unique symbol;
};

export const toCompiledTeal = (value: Uint8Array): CompiledTeal => {
  return to<CompiledTeal>(value);
};
