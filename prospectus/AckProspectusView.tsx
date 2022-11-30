import { Deps } from "../context/AppContext"
import { ProspectusView } from "./ProspectusView"

export const AckProspectusView = ({
  deps,
  url,
  hash,
}: {
  deps: Deps
  url: string
  hash: string
}) => {
  return (
    <div>
      <ProspectusView url={url} hash={hash} />
      <div>
        {
          "By acknowledging, you accept the conditions presented in this prospectus."
        }
      </div>
    </div>
  )
}
