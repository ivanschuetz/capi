import { OkModal } from "../modal/OkModal";
import { ProspectusView } from "./ProspectusView";

export const ProspectusModal = ({ url, closeModal, prospectusHash }) => {
  return (
    <OkModal title={"Prospectus"} closeModal={closeModal}>
      <ProspectusView url={url} hash={prospectusHash} />
    </OkModal>
  );
};
