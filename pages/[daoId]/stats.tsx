import React, { useContext, useEffect } from "react";
import { useDaoId } from "../../hooks/useDaoId";
import { SharesDistributionBox } from "../../components/SharesDistributionBox";
import { IncomeSpendingBox } from "../../components/IncomeSpendingBox";
import { AppContext } from "../../context/App";

const StatsPage = () => {
  const { deps } = useContext(AppContext);

  const daoId = useDaoId();

  useEffect(() => {
    deps.updateDao.call(null, daoId);
  }, [deps.updateDao, daoId]);

  return (
    <div>
      {deps.dao && <SharesDistributionBox deps={deps} />}

      <IncomeSpendingBox statusMsg={deps.statusMsg} daoId={daoId} />
    </div>
  );
};

export default StatsPage;
