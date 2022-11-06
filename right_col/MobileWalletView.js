import React, { useEffect } from "react";
import { MyAccount } from "../components/MyAccount";
import { useRouter } from "next/router";

export const MobileWalletView = ({ deps, containerClass, onClose }) => {
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

  return (
    <div id={containerClass}>
      <MyAccount deps={deps} daoId={daoId} onClose={onClose} />
    </div>
  );
};
