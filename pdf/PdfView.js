// import { useState } from "react";
// import { Document, Page } from "react-pdf/dist/esm/entry.webpack";

// export const PdfView = ({ url }) => {
//   const [numPages, setNumPages] = useState(null);
//   const [pageNumber, setPageNumber] = useState(1);

//   function onDocumentLoadSuccess({ numPages }) {
//     setNumPages(numPages);
//   }

//   return (
//     <div>
//       <Document file={url} onLoadSuccess={onDocumentLoadSuccess}>
//         <Page pageNumber={pageNumber} />
//       </Document>
//       <p>
//         Page {pageNumber} of {numPages}
//       </p>
//       <button onClick={() => setPageNumber(pageNumber - 1)}>{"prev"}</button>
//       <button onClick={() => setPageNumber(pageNumber + 1)}>{"next"}</button>
//     </div>
//   );
// };

export const PdfView = ({ url }) => {
  return <div>TODO pdf view</div>;
};
