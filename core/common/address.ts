import algosdk, { Address } from "algosdk";

export const encodeAddress = (address: Address) => {
  return algosdk.encodeAddress(address.publicKey);
};
