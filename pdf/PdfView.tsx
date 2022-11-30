import { useState } from "react"

// import default react-pdf entry
import { Document, Page, pdfjs } from "react-pdf"
// import pdf worker as a url, see `next.config.js` and `pdf-worker.js`
import workerSrc from "../pdf-worker"

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

export const PdfView = ({ url }: { url: string }) => {
  const [numPages, setNumPages] = useState(null)
  const [pageNumber, setPageNumber] = useState(1)

  function onDocumentLoadSuccess({ numPages }) {
    setNumPages(numPages)
  }

  return (
    <div>
      <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
        <Page pageNumber={pageNumber} />
      </Document>
      <p>
        Page {pageNumber} of {numPages}
      </p>
      <button onClick={() => setPageNumber(pageNumber - 1)}>{"prev"}</button>
      <button onClick={() => setPageNumber(pageNumber + 1)}>{"next"}</button>
    </div>
  )
}
