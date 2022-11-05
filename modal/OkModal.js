import { SubmitButton } from "../common_comps/SubmitButton";
import Modal from "./Modal";

export const OkModal = ({ title, closeModal, children, okLabel }) => {
  return (
    <Modal title={title} onCloseClick={() => closeModal()}>
      <div>
        {children}
        <div className="d-flex gap-40">
          <SubmitButton
            label={okLabel ?? "Ok"}
            className="button-primary"
            onClick={async () => closeModal()}
          />
        </div>
      </div>
    </Modal>
  );
};
