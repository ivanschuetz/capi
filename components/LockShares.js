import React, { useState } from "react";
import { lock } from "../controller/lock_shares";
import { LockOrUnlockShares } from "./LockOrUnlockShares";

export const LockShares = ({ deps, dao, daoId, onLockOpt }) => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      showInput={true}
      title={"Lock shares"}
      inputLabel={"Lock shares"}
      buttonLabel={"Lock"}
      submitting={submitting}
      onSubmit={async (input, setInputError) => {
        if (!deps.wasm) {
          // should be unlikely, as wasm should initialize quickly
          console.error("Click while wasm isn't ready. Ignoring.");
          return;
        }

        await lock(
          deps.wasm,
          deps.statusMsg,
          deps.myAddress,
          deps.wallet,
          deps.updateInvestmentData,
          deps.updateMyBalance,
          deps.updateMyShares,

          setSubmitting,
          daoId,
          dao,
          input,
          onLockOpt,
          setInputError
        );
      }}
    />
  );
};
