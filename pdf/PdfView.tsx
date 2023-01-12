import { useState } from "react"

// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf"
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../pdf-worker"

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export const PdfView = ({ url, title }: { url: string; title: string }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
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
      <button onClick={() => setPageNumber(pageNumber - 1)}>{"prev"}</button>
      <button onClick={() => setPageNumber(pageNumber + 1)}>{"next"}</button>
    </div>
  )
}
