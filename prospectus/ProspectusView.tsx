import { InfoView } from "../components/labeled_inputs"
import CopyPasteText, { CopyPasteHtml } from "../components/CopyPastText"
import { PdfView } from "../pdf/PdfView"
import { Notification } from "../components/Notification"

export const ProspectusView = ({
  url,
  hash,
  notification,
}: {
  url: string
  hash: string
  notification: Notification
}) => {
  return (
    <div>
      <div className="text-45">
        {
          "Please read this prospectus carefully, and acknowledge at the end if you want to proceed with the investment. Your acknowledgment will be recorded on the blockchain along with the prospectus hash."
        }
        <div className="mt-5 mb-5 flex items-center text-45">
          <div className="mr-2">{"Hash: "}</div>
          <CopyPasteHtml
            element={<div className="text-45 text-te">{hash}</div>}
            copyText={hash}
            notification={notification}
            copyMsg={"Prospectus hash copied to clipboard"}
          />
          <div className="w-2"></div>
          <InfoView
            text={
              "The hash identifies the current exact prospectus. Any change in the prospectus will render a different hash."
            }
          />
        </div>
      </div>
      <PdfView url={url} title={"Prospectus"} />
    </div>
  )
}
