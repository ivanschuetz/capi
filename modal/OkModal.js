import { SubmitButton } from "../components/SubmitButton";
import Modal from "./modal";

export const OkModal = ({ title, closeModal, children, okLabel }) => {
  return (
    <Modal title={title} onClose={() => closeModal()}>
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
