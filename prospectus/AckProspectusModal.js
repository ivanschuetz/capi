import { OkCancelModal } from "../modal/OkCancelModal";
import { AckProspectusView } from "./AckProspectusView";

export const AckProspectusModal = ({
  url,
  onAccept,
  closeModal,
  prospectusHash,
}) => {
  return (
    <OkCancelModal
      title={"Prospectus"}
      closeModal={closeModal}
      okLabel={"Acknowledge"}
      onSubmit={() => onAccept()}
    >
      <AckProspectusView url={url} hash={prospectusHash} />
    </OkCancelModal>
  );
};
