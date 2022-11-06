import React, { useEffect } from "react";
import { FundsActivityEmbedded } from "../components/FundsActivityEmbedded";
import { MyAccount } from "../components/MyAccount";
import { useRouter } from "next/router";

export const RightDaoCol = ({ deps }) => {
  const router = useRouter();
  const { daoId } = router.query;

  useEffect(() => {
    async function asyncFn() {
      await deps.updateMyShares.call(null, daoId, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [daoId, deps.myAddress, deps.updateMyShares]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyDividend.call(null, daoId, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [daoId, deps.myAddress, deps.updateMyDividend]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateFunds.call(null, daoId);
    }
    asyncFn();
  }, [daoId, deps.updateFunds]);

  return (
    <div id="rightcol">
      <MyAccount deps={deps} daoId={daoId} />
      <FundsActivityEmbedded deps={deps} daoId={daoId} />
    </div>
  );
};
