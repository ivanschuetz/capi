import { toBytes, toBytesForRust } from "../functions/utils";
import { storeIpfs, toMaybeIpfsUrl } from "../ipfs/store";
import { toErrorMsg } from "../functions/validation";

const wasmPromise = import("wasm");

export const prefillInputs = async (
  statusMsg,

  daoId,
  setDaoName,
  setDaoDescr,
  setSharePrice,
  setImageBytes,
  setSocialMediaUrl,
  setMinInvestShares,
  setMaxInvestShares,
  setProspectus
) => {
  try {
    const { bridge_updatable_data } = await wasmPromise;

    // prefill dao inputs
    let updatableData = await bridge_updatable_data({ dao_id: daoId });
    setDaoName(updatableData.project_name);
    setDaoDescr(updatableData.project_desc);
    setSharePrice(updatableData.share_price);
    // TODO header may not be needed - test without once everything else works, remove if not needed
    if (updatableData.image_base64) {
      setImageBytes("data:image/png;base64," + updatableData.image_base64);
    } else {
      setImageBytes(null);
    }
    setSocialMediaUrl(updatableData.social_media_url);
    setMinInvestShares(updatableData.min_invest_amount);
    setMaxInvestShares(updatableData.max_invest_amount);
    setProspectus(updatableData.prospectus);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateApp = async (
  statusMsg,
  myAddress,
  wallet,

  showProgress,
  daoId,
  approvalVersion,
  clearVersion,
  updateVersion
) => {
  try {
    const { bridge_update_app_txs, bridge_submit_update_app } =
      await wasmPromise;

    showProgress(true);
    let updateAppRes = await bridge_update_app_txs({
      dao_id: daoId,
      owner: myAddress,
      approval_version: approvalVersion,
      clear_version: clearVersion,
    });
    console.log("Update app res: %o", updateAppRes);
    showProgress(false);

    let updateAppResSigned = await wallet.signTxs(updateAppRes.to_sign);
    console.log("updateAppResSigned: " + JSON.stringify(updateAppResSigned));

    showProgress(true);
    let submitUpdateAppRes = await bridge_submit_update_app({
      txs: updateAppResSigned,
    });
    console.log("submitUpdateAppRes: " + JSON.stringify(submitUpdateAppRes));

    // re-fetch version data to update things that depend on "there's a new version" (e.g. settings badge)
    updateVersion(daoId);

    showProgress(false);
    statusMsg.success("App updated!");
  } catch (e) {
    statusMsg.error(e);
  }
};

export const updateDaoData = async (
  statusMsg,
  myAddress,
  wallet,
  updateDao,

  showProgress,
  daoId,
  projectName,
  daoDescr,
  sharePrice,
  imageBytes,
  socialMediaUrl,

  // OR: either bytes (new prospectus) or prospectus (existing prospectus) is set
  prospectusBytes,
  existingProspectus,

  minInvestShares,
  maxInvestShares,

  setDaoNameError,
  setDaoDescrError,
  setImageError,
  setProspectusError,
  setSocialMediaUrlError,
  setMinInvestSharesError,
  setMaxInvestSharesError
) => {
  try {
    const { bridge_update_data, bridge_submit_update_dao_data } =
      await wasmPromise;

    showProgress(true);

    const imageUrl = await toMaybeIpfsUrl(await imageBytes);
    const descrUrl = await toMaybeIpfsUrl(toBytes(await daoDescr));

    const prospectusInputs = await toProspectusInputs(
      existingProspectus,
      prospectusBytes
    );

    const data = {
      dao_id: daoId,

      project_name: projectName,
      project_desc_url: descrUrl,
      share_price: sharePrice,

      owner: myAddress,

      image_url: imageUrl,
      social_media_url: socialMediaUrl,

      prospectus_url: prospectusInputs?.url,
      prospectus_bytes: prospectusInputs?.bytes,
      prospectus_hash: prospectusInputs?.hash,

      min_invest_amount: minInvestShares,
      max_invest_amount: maxInvestShares,
    };
    // console.log("Will send update data to wasm: %o", data);

    let updateDataRes = await bridge_update_data(data);
    console.log("Update DAO data res: %o", updateDataRes);
    showProgress(false);

    let updateDataResSigned = await wallet.signTxs(updateDataRes.to_sign);
    console.log("updateDataResSigned: " + JSON.stringify(updateDataResSigned));

    showProgress(true);
    let submitUpdateDaoDataRes = await bridge_submit_update_dao_data({
      txs: updateDataResSigned,
      pt: updateDataRes.pt, // passthrough
    });
    console.log(
      "submitUpdateDaoDataRes: " + JSON.stringify(submitUpdateDaoDataRes)
    );

    await updateDao(daoId);

    statusMsg.success("Dao data updated!");

    showProgress(false);
  } catch (e) {
    if (e.id === "validations") {
      let details = e.details;
      setDaoNameError(toErrorMsg(details.name));
      setDaoDescrError(toErrorMsg(details.description));
      setImageError(toErrorMsg(details.image));

      // Note that this will make appear the prospectus errors incrementally, if both happen at once (normally not expected)
      // i.e. user has to fix one first and submit, then the other would appear
      if (details.prospectus_url) {
        setProspectusError(toErrorMsg(details.prospectus_url));
      } else if (details.prospectus_bytes) {
        setProspectusError(toErrorMsg(details.prospectus_bytes));
      }

      setSocialMediaUrlError(toErrorMsg(details.social_media_url));
      setMinInvestSharesError(toErrorMsg(details.min_invest_shares));
      setMaxInvestSharesError(toErrorMsg(details.max_invest_shares));

      statusMsg.error("Please fix the errors");
    } else {
      statusMsg.error(e);
    }
    showProgress(false);
  }
};

export const toProspectusInputs = async (
  existingProspectus,
  newProspectusBytesPromise
) => {
  const prospectusBytes = await newProspectusBytesPromise;

  // new prospectus: generate the IPFS url and return corresponding data
  // note that the bytes are returned too, to generate a hash in rust
  // the IPFS CID is not easily reproducible, so we manage a separate hash
  if (prospectusBytes && prospectusBytes.byteLength > 0) {
    const prospectusUrl = await storeIpfs(prospectusBytes);
    const prospectusBytesForRust = toBytesForRust(prospectusBytes);

    return { url: prospectusUrl, bytes: prospectusBytesForRust, hash: null };
    // no new prospectus data: return the existing prospectus
  } else if (existingProspectus) {
    return {
      url: existingProspectus.url,
      bytes: null,
      hash: existingProspectus.hash,
    };
  } else {
    // no new or pre-existing prospectus data (the prospectus is optional)
    return null;
  }
};

export const rekeyOwner = async (
  statusMsg,
  wallet,

  showProgress,
  daoId,
  authAddress,
  setInputError
) => {
  try {
    const { bridge_rekey_owner, bridge_submit_rekey_owner } = await wasmPromise;

    showProgress(true);
    let rekeyRes = await bridge_rekey_owner({
      dao_id: daoId,
      auth_address: authAddress,
    });
    console.log("rekeyRes: %o", rekeyRes);
    showProgress(false);

    let rekeySigned = await wallet.signTxs(rekeyRes.to_sign);
    console.log("rekeySigned: " + JSON.stringify(rekeySigned));

    showProgress(true);
    let submitRekeyRes = await bridge_submit_rekey_owner({
      txs: rekeySigned,
    });
    console.log("submitRekeyRes: " + JSON.stringify(submitRekeyRes));

    statusMsg.success(
      "Owner rekeyed to: " +
        authAddress +
        ". Please login with this account to be able to sign transactions."
    );
    showProgress(false);
  } catch (e) {
    if (e.id === "validation") {
      console.error("%o", e);
      setInputError(toErrorMsg(e.details));
    } else {
      statusMsg.error(e);
    }
    showProgress(false);
  }
};
