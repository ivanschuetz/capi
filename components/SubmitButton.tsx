export const SubmitButton = ({
  label,
  disabled,
  isLoading,
  onClick,
}: SubmitButtonPars) => {
  return (
    <Button
      label={label}
      disabled={disabled}
      isLoading={isLoading}
      bgColor="bg-pr"
      onClick={onClick}
    />
  )
}

export const CancelButton = ({
  label,
  disabled,
  isLoading,
  onClick,
}: SubmitButtonPars) => {
  return (
    <Button
      label={label}
      disabled={disabled}
      isLoading={isLoading}
      bgColor="bg-te"
      onClick={onClick}
    />
  )
}

const Button = ({
  label,
  disabled,
  isLoading,
  bgColor,
  onClick,
}: {
  label: string
  disabled?: boolean
  isLoading?: boolean
  bgColor: string
  onClick: () => void
}) => {
  return (
    <button
      className={`relative h-16 w-60 ${bgColor} text-45 font-bold text-bg transition duration-300 hover:bg-te disabled:pointer-events-none disabled:bg-quat disabled:text-te2`}
      disabled={disabled}
      onClick={async () => {
        onClick()
      }}
    >
      <span className={isLoading ? "opacity-0" : ""}>{label}</span>

      {isLoading && (
        <svg className="btn-loader" viewBox="0 0 40 40">
          <circle
            className="path-btn"
            cx="20"
            cy="20"
            r="16"
            fill="none"
            strokeWidth="5"
            strokeMiterlimit="10"
          ></circle>
        </svg>
      )}
    </button>
  )
}

type SubmitButtonPars = {
  label: string
  disabled?: boolean
  isLoading?: boolean
  onClick: () => void
}
