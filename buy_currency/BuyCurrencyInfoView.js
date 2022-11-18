import { SubmitButton } from "../components/SubmitButton"
import useScript from "../hooks/useScript"

export const BuyCurrencyInfoView = ({ closeModal, children, onSubmit }) => {
  useScript("https://verify.sendwyre.com/js/verify-module-init-beta.js")

  return (
    <div>
      {children}
      <div>
        <SubmitButton
          label={"Continue"}
          className="button-primary w-100"
          onClick={async () => onSubmit()}
        />
        <SubmitButton
          label={"Cancel"}
          className="button-primary w-100"
          onClick={async () => closeModal()}
        />
      </div>
    </div>
  )
}
