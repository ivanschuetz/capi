const acceptDisclaimerKey = "acceptedDisclaimer";

export const needsToAcceptDisclaimer = async () => {
  return !localStorage.getItem(acceptDisclaimerKey);
};

export const saveAcceptedDisclaimer = async () => {
  return localStorage.setItem(acceptDisclaimerKey, true);
};

export const clearAcceptedDisclaimer = async () => {
  return localStorage.removeItem(acceptDisclaimerKey);
};

export const saveDevSettingCapiAddress = async (address) => {
  // read in WASM
  return localStorage.setItem("CAPI_ADDRESS", address);
};

export const saveDevSettingFundsAssetId = async (id) => {
  // read in WASM
  return localStorage.setItem("FUNDS_ASSET_ID", id);
};
