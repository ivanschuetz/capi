import React, { useEffect } from "react";
import { FundsActivityEmbedded } from "../components/FundsActivityEmbedded";
import { MyAccount } from "../components/MyAccount";
import { useDaoId } from "../hooks/useDaoId";

export const RightDaoCol = ({ deps }) => {
  const daoId = useDaoId();

  useEffect(() => {
    async function asyncFn() {
      await deps.updateMyShares.call(null, daoId, deps.myAddress);
    }
    if (daoId && deps.myAddress) {
      asyncFn();
    }
  }, [daoId, deps.myAddress, deps.updateMyShares]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyDividend.call(null, daoId, deps.myAddress);
    }
    if (daoId && deps.myAddress) {
      asyncFn();
    }
  }, [daoId, deps.myAddress, deps.updateMyDividend]);

  useEffect(() => {
    async function asyncFn() {
      deps.updateFunds.call(null, daoId);
    }
    if (daoId) {
      asyncFn();
    }
  }, [daoId, deps.updateFunds]);

  return (
    <div id="rightcol">
      {daoId && <MyAccount deps={deps} daoId={daoId} />}
      {daoId && <FundsActivityEmbedded deps={deps} daoId={daoId} />}
    </div>
  );
};
