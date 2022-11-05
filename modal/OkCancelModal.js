import { SubmitButton } from "../components/SubmitButton";
import Modal from "./Modal";

export const OkCancelModal = ({
  title,
  closeModal,
  children,
  onSubmit,
  okLabel,
  cancelLabel,
}) => {
  return (
    <Modal title={title} onCloseClick={() => closeModal()}>
      <div>
        {children}
        <div className="d-flex gap-40">
          <SubmitButton
            label={okLabel ?? "Continue"}
            className="button-primary"
            onClick={async () => onSubmit()}
          />
          <SubmitButton
            label={cancelLabel ?? "Cancel"}
            className="button-cyan"
            onClick={async () => closeModal()}
          />
        </div>
      </div>
    </Modal>
  );
};
