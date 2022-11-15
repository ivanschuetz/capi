import { OkCancelModal } from "../modal/OkCancelModal";
import { PdfView } from "./PdfView";

export const PdfModal = ({ url, onAccept, closeModal }) => {
  return (
    <OkCancelModal
      title={"Disclaimer"}
      closeModal={closeModal}
      okLabel={"Accept"}
      onSubmit={() => onAccept()}
    >
      <PdfView url={url} />
    </OkCancelModal>
  );
};
