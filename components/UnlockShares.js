import React, { useState } from "react";
import { unlock } from "../controller/investment";
import { LockOrUnlockShares } from "./LockOrUnlockShares";

export const UnlockShares = ({ deps, dao, daoId }) => {
  const [submitting, setSubmitting] = useState(false);

  return (
    <LockOrUnlockShares
      dao={dao}
      investmentData={deps.investmentData}
      // currently we allow only to unlock all the shares
      showInput={false}
      title={"Unlock shares"}
      buttonLabel={"Unlock"}
      submitting={submitting}
      onSubmit={async () => {
        if (!deps.wasm) {
          // should be unlikely, as wasm should initialize quickly
          console.error("Click while wasm isn't ready. Ignoring.");
          return;
        }

        await unlock(
          deps.wasm,
          deps.statusMsg,
          deps.myAddress,
          deps.wallet,
          deps.updateInvestmentData,
          deps.updateMyBalance,
          deps.updateMyShares,
          setSubmitting,
          daoId
        );
      }}
    />
  );
};
