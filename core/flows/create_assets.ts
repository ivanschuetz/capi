import {
  Address,
  Algodv2,
  makeApplicationCreateTxnFromObject,
  makeAssetCreateTxnWithSuggestedParamsFromObject,
  OnApplicationComplete,
  SuggestedParams,
  Transaction,
} from "algosdk";
import Compile from "algosdk/dist/types/src/client/v2/algod/compile";
import { encodeAddress } from "../common/address";
import {
  AppId,
  CompiledTeal,
  FundsAmount,
  FundsAsset,
  Integer,
  ShareAmount,
  TealSource,
  TealSourceTemplate,
  VersionedTealSourceTemplate,
} from "../common/types";
import { from, to } from "../infra/newtype";
import { CapiAddress, CapiAssetDaoDeps } from "../models/capi_deps";
import { CreateSharesSpecs } from "../models/CreateSharesSpecs";
import { SetupDaoSpecs } from "../models/SetupDaoSpecs";
import { SharesPercentage } from "../models/SharesPercentage";

// dao name, dao descr, social media, versions, image nft url, prospectus url, prospectus hash, team url
const GLOBAL_SCHEMA_NUM_BYTE_SLICES = 8;
// total received, shares asset id, funds asset id, share price, investors part, shares locked, funds target, funds target date,
// raised, image nft asset id, setup date, min invest shares, max invest shares
const GLOBAL_SCHEMA_NUM_INTS = 14;

const LOCAL_SCHEMA_NUM_BYTE_SLICES = 3; // signed prospectus url, signed prospectus hash, signed prospectus timestamp
const LOCAL_SCHEMA_NUM_INTS = 3; // for investors: "shares", "claimed total", "claimed init"

export type CreateAssetsTxs = {
  createApp: Transaction;
  createShares: Transaction;
};

export const createAssetsTxs = async (
  algod: Algodv2,
  creator: Address,
  specs: SetupDaoSpecs,
  appApproval: VersionedTealSourceTemplate,
  appClear: VersionedTealSourceTemplate,
  precision: Integer,
  capiDeps: CapiAssetDaoDeps,
  maxRaisableAmount: FundsAmount
): Promise<CreateAssetsTxs> => {
  const params = await algod.getTransactionParams().do();
  const createSharesTx = makeCreateSharesTx(params, specs.shares, creator);

  const createAppTx = await makeCreateAppTx(
    algod,
    appApproval,
    appClear,
    creator,
    specs.shares.supply,
    precision,
    specs.investorsShare,
    params,
    capiDeps,
    specs.sharePrice,
    maxRaisableAmount
  );

  return { createShares: createSharesTx, createApp: createAppTx };
};

const makeCreateSharesTx = (
  params: SuggestedParams,
  specs: CreateSharesSpecs,
  creator: Address
): Transaction => {
  const unitAndAssetName = specs.tokenName;
  return makeAssetCreateTxnWithSuggestedParamsFromObject({
    from: encodeAddress(creator),
    total: from(specs.supply),
    decimals: 0,
    assetName: unitAndAssetName,
    unitName: unitAndAssetName,
    defaultFrozen: false,
    suggestedParams: params,
  });
};

const makeCreateAppTx = async (
  algod: Algodv2,
  approvalTemplate: VersionedTealSourceTemplate,
  clearTemplate: VersionedTealSourceTemplate,
  creator: Address,
  shareSupply: ShareAmount,
  precision: Integer,
  investorsShare: SharesPercentage,
  params: SuggestedParams,
  capiDeps: CapiAssetDaoDeps,
  sharePrice: FundsAmount,
  // checked in teal (it's guaranteed that no more can be raised)
  // expected to be determined by regulations, normally
  maxRaisableAmount: FundsAmount
): Promise<Transaction> => {
  const approvalProgram: CompiledTeal = await renderAndCompileAppApproval(
    algod,
    approvalTemplate,
    shareSupply,
    precision,
    investorsShare,
    capiDeps.address,
    capiDeps.escrow_percentage,
    sharePrice,
    maxRaisableAmount
  );
  const clearProgram = await renderAndCompileAppClear(algod, clearTemplate);

  return makeApplicationCreateTxnFromObject({
    from: encodeAddress(creator),
    suggestedParams: params,
    onComplete: OnApplicationComplete.NoOpOC,
    approvalProgram: from(approvalProgram),
    clearProgram: from(clearProgram),
    numLocalInts: LOCAL_SCHEMA_NUM_INTS,
    numLocalByteSlices: LOCAL_SCHEMA_NUM_BYTE_SLICES,
    numGlobalInts: GLOBAL_SCHEMA_NUM_INTS,
    numGlobalByteSlices: GLOBAL_SCHEMA_NUM_BYTE_SLICES,
    extraPages: 1,
  });
};

const renderAndCompileAppApproval = async (
  algod: Algodv2,
  template: VersionedTealSourceTemplate,
  shareSupply: ShareAmount,
  precision: Integer,
  investorsShare: SharesPercentage,
  capiAddress: CapiAddress,
  capiPercentage: SharesPercentage,
  sharePrice: FundsAmount,
  maxRaisableAmount: FundsAmount
): Promise<CompiledTeal> => {
  // >TODO how to ensure that this is set?
  var source;

  switch (from(template.version)) {
    case 1:
      source = renderCentralAppApprovalV1(
        template.template,
        shareSupply,
        precision,
        investorsShare,
        capiAddress,
        capiPercentage,
        sharePrice,
        maxRaisableAmount
      );
      break;
    // case 2:
    //   console.log("variable is not set here!");
    default:
      throw new Error("Dao app approval version not supported: {:?}");
  }

  // >TODO compile returns `any` (not Uint8Array which is wrapped by TealSource) - why? and anyway, we should guard this
  const json: any = await algod.compile(source).do();
  //   const arr = Buffer.from(result, 'base64')
  const bytes = Uint8Array.from(atob(json.result), (c) => c.charCodeAt(0));
  return to<CompiledTeal>(bytes);
};

const renderAndCompileAppClear = async (
  algod: Algodv2,
  template: VersionedTealSourceTemplate
): Promise<CompiledTeal> => {
  // >TODO how to ensure that this is set at the end
  var source;

  switch (from(template.version)) {
    case 1:
      source = renderAppClearV1(template.template);
      break;
    default:
      throw new Error(
        `Dao app clear version not supported: ${template.version}`
      );
  }

  const json: any = await algod.compile(source).do();
  //   const arr = Buffer.from(result, 'base64')
  const bytes = Uint8Array.from(atob(json.result), (c) => c.charCodeAt(0));
  return to<CompiledTeal>(bytes);
};

const renderAppClearV1 = (template: TealSourceTemplate): TealSource => {
  return to<TealSource>(from(template));
};

const renderCentralAppApprovalV1 = (
  source: TealSourceTemplate,
  shareSupply: ShareAmount,
  precision: Integer,
  investors_share: SharesPercentage,
  capiAddress: CapiAddress,
  capiPercentage: SharesPercentage,
  sharePrice: FundsAmount,
  maxRaisableAmount: FundsAmount
): TealSource => {
  // >TODO checked
  const precisionSquare = from(precision) * from(precision);

  // >TODO checked
  // TODO write tests that catch incorrect/variable supply - previously it was hardcoded to 100 and everything was passing
  const investorsSharePercentage =
    from(investors_share) * Math.floor(from(precision));

  // >TODO checked
  const capiShare = Math.floor(from(capiPercentage) * from(precision));

  let rendered = renderTemplate(
    source,
    new Map([
      ["TMPL_SHARE_SUPPLY", from(shareSupply).toString()],
      ["TMPL_INVESTORS_SHARE", investorsSharePercentage.toString()],
      ["TMPL_PRECISION__", from(precision).toString()],
      ["TMPL_PRECISION_SQUARE", precisionSquare.toString()],
      ["TMPL_CAPI_ESCROW_ADDRESS", encodeAddress(from(capiAddress)).toString()],
      ["TMPL_CAPI_SHARE", capiShare.toString()],
      ["TMPL_SHARE_PRICE", from(sharePrice).toString()],
      ["TMPL_MAX_RAISABLE_AMOUNT", from(maxRaisableAmount).toString()],
    ])
  );

  // save_rendered_teal("dao_app_approval", redered); // debugging
  return rendered;
};

const renderTemplate = (
  template: TealSourceTemplate,
  keyValues: Map<string, string>
): TealSource => {
  // TODO ensure that this utf-8 (doc doesn't say?)?
  let tealStr = new TextDecoder().decode(from(template));

  keyValues.forEach((value: string, key: string) => {
    tealStr = tealStr.replaceAll(key, value);
  });

  //   console.log("Rendered tealStr: " + tealStr);

  return to<TealSource>(new TextEncoder().encode(tealStr));
};
