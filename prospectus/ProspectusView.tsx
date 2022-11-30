import { PdfView } from "../pdf/PdfView"

export const ProspectusView = ({
  url,
  hash,
}: {
  url: string
  hash: string
}) => {
  return (
    <div>
      <PdfView url={url} />
      <div>
        <span>{"Hash: "}</span>
        <span>{hash}</span>
      </div>
    </div>
  )
}
