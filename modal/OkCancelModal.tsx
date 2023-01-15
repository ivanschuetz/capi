import { CancelButton, SubmitButton } from "../components/SubmitButton"
import Modal from "./Modal"

export const OkCancelModal = ({
  title,
  onCancel,
  children,
  onSubmit,
  okLabel,
  cancelLabel,
}: {
  title: string
  onCancel: () => void
  children: JSX.Element
  onSubmit: () => void
  okLabel?: string
  cancelLabel?: string
}) => {
  return (
    <Modal title={title} onClose={() => onCancel()}>
      <div>
        {children}
        <div className="d-flex gap-40">
          <CancelButton
            label={cancelLabel ?? "Cancel"}
            onClick={async () => onCancel()}
          />
          <SubmitButton
            label={okLabel ?? "Continue"}
            onClick={async () => onSubmit()}
          />
        </div>
      </div>
    </Modal>
  )
}
