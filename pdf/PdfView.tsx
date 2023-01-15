import { useState } from "react"
// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf"
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../pdf-worker"

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export type PageInfo = {
  current: number
  isFirst: boolean
  isLast: boolean
}

export const PdfView = ({
  url,
  title,
  pageNumber,
  onPageCount,
}: {
  url: string
  title: string
  pageNumber: number
  onPageCount: (count: number) => void
}) => {
  const [numPages, setNumPages] = useState(null)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
    onPageCount(numPages)
  }

  return (
    <div>
      <div className="flex items-center">
        <div className="flex-grow text-70 font-bold text-te">{title}</div>
        <div className="text-50 font-bold text-te">
          {pageNumber}/{numPages}
        </div>
      </div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
    </div>
  )
}
