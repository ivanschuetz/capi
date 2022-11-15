import { PdfView } from "../pdf/PdfView";

export const ProspectusView = ({ deps, url, hash }) => {
  return (
    <div>
      <PdfView url={url} />
      <div>
        <span>{"Hash: "}</span>
        <span>{hash}</span>
      </div>
    </div>
  );
};
