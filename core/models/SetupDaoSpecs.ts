import { FundsAmount, ShareAmount, Timestamp } from "../common/types";
import { CreateSharesSpecs } from "./CreateSharesSpecs";
import { Prospectus } from "./Prospectus";
import { SharesPercentage } from "./SharesPercentage";

export type SetupDaoSpecs = {
  name: string;
  descrUrl?: string;
  shares: CreateSharesSpecs;
  investorsShare: SharesPercentage;
  sharePrice: FundsAmount;
  imageUrl?: string;
  socialMediaUrl: string; // this can be later in an extension (possibly with more links)
  /**
   * shares to be sold to investors (the rest stay in the creator's account)
   * note this is entirely different from investors_share, which is the % of the project's income channeled to investors
   */
  sharesForInvestors: ShareAmount;
  /**
   * we manage this as timestamp instead of date,
   * to ensure correctness when storing the timestamp in TEAL / compare to current TEAL timestamp (which is in seconds)
   * DateTime can have millis and nanoseconds too,
   * which would e.g. break equality comparisons between these specs and the ones loaded from global state
   */
  raiseEndDate: Timestamp;
  raiseMinTarget: FundsAmount;

  prospectus?: Prospectus;

  minInvestAmount: ShareAmount;
  maxInvestAmount: ShareAmount;
};
