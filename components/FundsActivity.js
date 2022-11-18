import React, { useEffect, useState } from "react";
import { ContentTitle } from "./ContentTitle";
import { loadFundsActivity } from "../controller/funds_activity";
import { FundsActivityEntry } from "./FundsActivityEntry";
import Progress from "./Progress";
import { SubmitButton } from "./SubmitButton";
import Link from "next/link";
import { useDaoId } from "../hooks/useDaoId";

export const FundsActivity = ({ deps }) => {
  const daoId = useDaoId();

  const [activityEntries, setActivityEntries] = useState(null);

  useEffect(() => {
    if (deps.wasm) {
      loadFundsActivity(
        deps.wasm,
        deps.statusMsg,
        daoId,
        setActivityEntries,
        null
      );
    }
  }, [deps.wasm, daoId, deps.statusMsg]);

  const fundsActivity = () => {
    if (activityEntries) {
      if (activityEntries.length > 0) {
        return (
          <div>
            {activityEntries &&
              activityEntries.map((entry) => (
                <FundsActivityEntry
                  deps={deps}
                  entry={entry}
                  showDescr={true}
                  key={entry.tx_id}
                />
              ))}
          </div>
        );
      } else {
        return <NoActivityView daoId={daoId} />;
      }
    } else {
      return <Progress />;
    }
  };

  const view = () => {
    return (
      <div className="mt-80 mb-80">
        <ContentTitle title={"Funds activity"} />
        <div className="mt-40">{fundsActivity()}</div>
      </div>
    );
  };

  return <div>{view()}</div>;
};

const NoActivityView = ({ daoId }) => {
  return (
    <div className="d-flex w-100 justify-center">
      <div className="no-activity">
        <div className="title mb-6">{"No activity yet"}</div>
        <div className="ft-weight-600 grey-190">
          {"Let's make some investments!"}
        </div>
        <Link href={"/" + daoId} className="text-center w-100">
          <SubmitButton
            label={"Buy shares"}
            className="button-primary w-100"
            onClick={async () => {}}
          />
        </Link>
      </div>
    </div>
  );
};
