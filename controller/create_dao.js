import { toBytes, toBytesForRust } from "../functions/common";
import { toErrorMsg } from "../functions/validation";
import { toMaybeIpfsUrl } from "../ipfs/store";

const wasmPromise = import("wasm");

export const createDao = async (
  statusMsg,
  myAddress,
  wallet,
  updateMyBalance,

  showProgress,

  daoName,
  daoDescr,
  shareCount,
  sharePrice,
  investorsShare,
  sharesForInvestors,
  imageBytes,
  socialMediaUrl,
  minRaiseTarget,
  minRaiseTargetEndDate,
  prospectusBytes,
  minInvestShares,
  maxInvestShares,

  router,

  setDaoNameError,
  setDaoDescrError,
  setShareCountError,
  setSharePriceError,
  setInvestorsShareError,
  setSharesForInvestorsError,
  setImageError,
  setProspectusError,
  setSocialMediaUrlError,
  setMinRaiseTargetError,
  setMinRaiseTargetEndDateError,
  setMinInvestSharesError,
  setMaxInvestSharesError,
  setShowBuyCurrencyInfoModal
) => {
  const {
    bridge_create_dao_assets_txs,
    bridge_create_dao,
    bridge_submit_create_dao,
  } = await wasmPromise;

  statusMsg.clear();

  showProgress(true);

  const imageUrl = await toMaybeIpfsUrl(await imageBytes);
  const descrUrl = await toMaybeIpfsUrl(toBytes(await daoDescr));

  const prospectusBytesResolved = await prospectusBytes;
  const prospectusUrl = await toMaybeIpfsUrl(prospectusBytesResolved);
  const prospectusBytesForRust = toBytesForRust(prospectusBytesResolved);

  try {
    let createDaoAssetsRes = await bridge_create_dao_assets_txs({
      inputs: {
        creator: myAddress,
        dao_name: daoName,
        dao_descr_url: descrUrl,
        share_count: shareCount,
        share_price: sharePrice,
        investors_share: investorsShare,
        shares_for_investors: sharesForInvestors,
        image_url: imageUrl,
        social_media_url: socialMediaUrl,
        min_raise_target: minRaiseTarget,
        min_raise_target_end_date: minRaiseTargetEndDate.unix() + "",
        // min_raise_target_end_date:
        //   Math.ceil(Date.now() / 1000) + 30 /* seconds */ + "", // end date after short delay - for testing
        prospectus_url: prospectusUrl,
        prospectus_bytes: prospectusBytesForRust,
        min_invest_amount: minInvestShares,
        max_invest_amount: maxInvestShares,
      },
    });
    showProgress(false);

    let createAssetSigned = await wallet.signTxs(createDaoAssetsRes.to_sign);
    console.log("createAssetSigned: " + JSON.stringify(createAssetSigned));

    showProgress(true);
    let createDaoRes = await bridge_create_dao({
      create_assets_signed_txs: createAssetSigned,
      pt: createDaoAssetsRes.pt,
    });
    console.log("createDaoRes: " + JSON.stringify(createDaoRes));
    showProgress(false);

    let createDaoSigned = await wallet.signTxs(createDaoRes.to_sign);
    console.log("createDaoSigned: " + JSON.stringify(createDaoSigned));

    showProgress(true);
    let submitDaoRes = await bridge_submit_create_dao({
      txs: createDaoSigned,
      pt: createDaoRes.pt, // passthrough
    });
    console.log("submitDaoRes: " + JSON.stringify(submitDaoRes));

    router.push(submitDaoRes.dao.dao_link);

    showProgress(false);
    statusMsg.success("Project created!");

    await updateMyBalance(myAddress);
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setDaoNameError(toErrorMsg(e.name));
      setDaoDescrError(toErrorMsg(e.description));
      setShareCountError(toErrorMsg(e.share_supply));
      setSharePriceError(toErrorMsg(e.share_price));
      setInvestorsShareError(toErrorMsg(e.investors_share));
      setImageError(toErrorMsg(e.logo_url));
      setSocialMediaUrlError(toErrorMsg(e.social_media_url));
      setMinRaiseTargetError(toErrorMsg(e.min_raise_target));
      setMinRaiseTargetEndDateError(toErrorMsg(e.min_raise_target_end_date));
      setMinInvestSharesError(toErrorMsg(e.min_invest_shares));
      setMaxInvestSharesError(toErrorMsg(e.max_invest_shares));
      setSharesForInvestorsError(toErrorMsg(e.shares_for_investors));

      // note that here, the later will override the former if both are set
      // this is ok - we don't expect any of these to happen, normally,
      // and this is in theory oriented towards being fixable by the user,
      // in which case it can be done incrementally
      // the console in any case logs all the errors simultaneously

      setImageError(toErrorMsg(e.image_url));
      // Note that this will make appear the prospectus errors incrementally, if both happen at once (normally not expected)
      // i.e. user has to fix one first and submit, then the other would appear
      if (e.prospectus_url) {
        setProspectusError(toErrorMsg(e.prospectus_url));
      } else if (e.prospectus_bytes) {
        setProspectusError(toErrorMsg(e.prospectus_bytes));
      }

      // workaround: the inline errors for these are not functional yet, so show as notification
      showErrorNotificationIfError(statusMsg, e.image_url);
      showErrorNotificationIfError(statusMsg, e.prospectus_url);
      showErrorNotificationIfError(statusMsg, e.prospectus_bytes);

      // show a general message additionally, just in case
      statusMsg.error("Please fix the errors");
    } else if (e.id === "not_enough_algos") {
      setShowBuyCurrencyInfoModal(true);
    } else {
      statusMsg.error(e);
    }

    showProgress(false);
  }
};

const showErrorNotificationIfError = (statusMsg, payload) => {
  const errorMsg = toErrorMsg(payload);
  if (errorMsg) {
    statusMsg.error(errorMsg);
  }
};

export const calculateTotalPrice = async (
  shareAmount,
  sharePrice,
  setTotalPrice
) => {
  if (!shareAmount || !sharePrice) {
    return;
  }

  const { bridge_calculate_max_funds } = await wasmPromise;

  try {
    let version = bridge_wasm_version();
    let res = await bridge_calculate_max_funds({
      shares_amount: shareAmount,
      share_price: sharePrice,
    });
    console.log("res: %o", res);

    setTotalPrice(res.total_price);
  } catch (e) {
    // errors for now ignored: this is calculated on the fly to show the result in the form
    // we currently don't show any validation errors before submitting
    console.error("Ignored: error calculating total price: %o", e);
    setTotalPrice("");
  }
};
