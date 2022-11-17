import React, { useContext, useEffect, useState } from "react";
import { useDaoId } from "../../hooks/useDaoId";
import { init } from "../../controller/stats";
import { SharesDistributionBox } from "../../components/SharesDistributionBox";
import { IncomeSpendingBox } from "../../components/IncomeSpendingBox";
import { AppContext } from "../../context/App";

const StatsPage = () => {
  const { deps } = useContext(AppContext);

  const daoId = useDaoId();

  const [dao, setDao] = useState(null);

  useEffect(() => {
    async function asyncInit() {
      //   console.log("loading dao id: " + JSON.stringify(params));
      await init(deps.wasm, deps.statusMsg, daoId, setDao);
    }
    if (deps.wasm) {
      asyncInit();
    }
  }, [deps.wasm, deps.statusMsg, daoId]);

  return (
    <div>
      {dao && <SharesDistributionBox deps={deps} />}

      <IncomeSpendingBox statusMsg={deps.statusMsg} daoId={daoId} />
    </div>
  );
};

export default StatsPage;
