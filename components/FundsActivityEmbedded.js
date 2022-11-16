import React, { useEffect, useState } from "react";
import Link from "next/link";
import { loadDao } from "../controller/funds_activity";
import funds from "../images/funds.svg";
import { changeArrow, shortedAddress } from "../functions/utils";
import CopyPasteText from "../components/CopyPastText";
import { CompactFundsActivityEntry } from "./CompactFundsActivityEntry";
import Progress from "../components/Progress";

export const FundsActivityEmbedded = ({ deps, daoId }) => {
  const [dao, setDao] = useState(null);

  useEffect(() => {
    if (deps.wasm) {
      // TODO use dao in deps? - might need to call update
      loadDao(deps.wasm, deps.statusMsg, daoId, setDao);
    }
  }, [deps.wasm, daoId, deps.statusMsg]);

  useEffect(() => {
    deps.updateCompactFundsActivity.call(null, daoId);
  }, [deps.updateCompactFundsActivity, daoId]);

  const hasEntries = () => {
    return deps.compactFundsActivity && deps.compactFundsActivity.length > 0;
  };

  const fundsActivity = () => {
    if (deps.compactFundsActivity) {
      if (deps.compactFundsActivity.length > 0) {
        return (
          <div>
            {deps.compactFundsActivity.map((entry) => (
              <CompactFundsActivityEntry
                entry={entry}
                showDescr={false}
                key={entry.tx_id}
              />
            ))}
          </div>
        );
      } else {
        return null;
      }
    } else {
      return <Progress />;
    }
  };

  const box = () => {
    return (
      <div className="first_dao_widget">
        {deps.funds && (
          <div className="d-flex flex-column gap-12">
            <div className="desc">{"Project funds"}</div>
            <div className="d-flex align-center gap-10">
              <img src={funds.src} alt="funds" />
              <div className="subtitle">{deps.funds}</div>
              <div>{changeArrow(deps.fundsChange)}</div>
            </div>
          </div>
        )}
        {dao && (
          <div className="project-wallet">
            <div className="grey-190">{"Project wallet address:"}</div>
            <CopyPasteText
              text={shortedAddress(dao.app_address)}
              copyText={dao.app_address}
              statusMsg={deps.statusMsg}
              copyMsg={"Address copied to clipboard"}
            />
          </div>
        )}
        {hasEntries() && (
          <div>
            <div className="mt-32 ft-weight-600 mb-32 ft-size-18">
              {"Recent funds activity"}
            </div>
            {fundsActivity()}
            <Link
              className="text-center d-flex justify-center"
              href="funds_activity"
            >
              <button className="link_button">{"See all"}</button>
            </Link>
          </div>
        )}
      </div>
    );
  };

  const view = () => {
    if (deps.funds || dao || hasEntries()) {
      return box();
    } else {
      return null;
    }
  };

  return <div>{view()}</div>;
};
