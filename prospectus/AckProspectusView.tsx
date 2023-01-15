import { Deps } from "../context/AppContext"
import { PageInfo } from "../pdf/PdfView"
import { ProspectusView } from "./ProspectusView"

export const AckProspectusView = ({
  deps,
  url,
  hash,
  pageNumber,
  onPageCount,
}: {
  deps: Deps
  url: string
  hash: string
  pageNumber: number
  onPageCount: (count: number) => void
}) => {
  return (
    <div>
      <ProspectusView
        url={url}
        hash={hash}
        notification={deps.notification}
        pageNumber={pageNumber}
        onPageCount={onPageCount}
      />
      <div className="mb-5 mt-5 text-te">
        {
          "By acknowledging, you accept the conditions presented in this prospectus."
        }
      </div>
    </div>
  )
}
