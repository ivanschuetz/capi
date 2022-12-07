import { SubmitButton } from "../components/SubmitButton"
import useScript from "../hooks/useScript"

export const BuyCurrencyInfoView = ({ closeModal, children, onSubmit }) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js")

  return (
    <div>
      {children}
      <div>
        <SubmitButton label={"Continue"} onClick={async () => onSubmit()} />
        <SubmitButton label={"Cancel"} onClick={async () => closeModal()} />
      </div>
    </div>
  )
}
