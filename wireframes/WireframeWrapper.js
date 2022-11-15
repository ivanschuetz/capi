import React, { useEffect } from "react";
import { Wireframe } from "./Wireframe";
import { WireframeMobile } from "./WireframeMobile";
import { useDaoId } from "../hooks/useDaoId";

// TODO nextjs
// export const WireframeWrapper = ({ isGlobal, deps }) => {
export const WireframeWrapper = ({ isGlobal, deps, nested }) => {
  const daoId = useDaoId();

  useEffect(() => {
    async function asyncInit() {
      if (daoId) {
        deps.updateDao.call(null, daoId);
        deps.updateDaoVersion.call(null, daoId);
      }
    }
    asyncInit();
  }, [daoId, deps.statusMsg, deps.updateDaoVersion, deps.updateDao]);

  // clear possible notification
  useEffect(() => {
    deps.statusMsg.clear();
    // TODO nextjs - do we actually still need this effect? the notifications disappear with time
    // }, [deps.statusMsg, location]);
  }, [deps.statusMsg]);

  return deps.size.s4 ? (
    <WireframeMobile isGlobal={isGlobal} deps={deps} nested={nested} />
  ) : (
    <Wireframe isGlobal={isGlobal} deps={deps} nested={nested} />
  );
};
