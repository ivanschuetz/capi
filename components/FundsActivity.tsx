import Link from "next/link"
import { useEffect, useState } from "react"
import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"
import { useDaoId } from "../hooks/useDaoId"
import { ContentTitle } from "./ContentTitle"
import { FundsActivityEntry } from "./FundsActivityEntry"
import Progress from "./Progress"
import { SubmitButton } from "./SubmitButton"
import { FundsActivityViewData } from "wasm/wasm"

export const FundsActivity = ({ deps }: { deps: Deps }) => {
  const daoId = useDaoId()

  const [activityEntries, setActivityEntries] = useState(null)

  updateActivityEntries(deps, daoId, setActivityEntries)

  return (
    <div>
      {" "}
      <div className="mt-80 mb-80">
        <ContentTitle title={"Funds activity"} />
        <div className="mt-40">
          <Activity
            deps={deps}
            daoId={daoId}
            activityEntries={activityEntries}
          />
        </div>
      </div>
    </div>
  )
}

const Activity = ({
  deps,
  daoId,
  activityEntries,
}: {
  deps: Deps
  daoId: string
  activityEntries: FundsActivityViewData[]
}) => {
  if (activityEntries) {
    if (activityEntries.length > 0) {
      return (
        <div>
          {activityEntries &&
            activityEntries.map((entry) => (
              <FundsActivityEntry deps={deps} entry={entry} key={entry.tx_id} />
            ))}
        </div>
      )
    } else {
      return <NoActivityView daoId={daoId} />
    }
  } else {
    return <Progress />
  }
}

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
  )
}

const updateActivityEntries = (
  deps: Deps,
  daoId: string,
  setActivityEntries: (entries: FundsActivityViewData[]) => void
) => {
  useEffect(() => {
    if (deps.wasm) {
      safe(deps.notification, async () => {
        const res = await deps.wasm.loadFundsActivity({
          dao_id: daoId,
          max_results: null,
        })
        console.log("funds activity res: " + JSON.stringify(res))
        setActivityEntries(res.entries)
      })
    }
  }, [deps.wasm, daoId, deps.notification])
}
