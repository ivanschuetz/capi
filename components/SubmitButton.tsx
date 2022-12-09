export const SubmitButton = ({
  label,
  disabled,
  isLoading,
  onClick,
  fullWidth,
}: SubmitButtonPars) => {
  return (
    <Button
      label={label}
      disabled={disabled}
      isLoading={isLoading}
      bgColor="bg-pr"
      onClick={onClick}
      fullWidth={fullWidth}
    />
  )
}

export const CancelButton = ({
  label,
  disabled,
  isLoading,
  onClick,
  fullWidth,
}: SubmitButtonPars) => {
  return (
    <Button
      label={label}
      disabled={disabled}
      isLoading={isLoading}
      bgColor="bg-te"
      onClick={onClick}
      fullWidth={fullWidth}
    />
  )
}

const Button = ({
  label,
  disabled,
  isLoading,
  bgColor,
  onClick,
  fullWidth,
}: {
  label: string
  disabled?: boolean
  isLoading?: boolean
  bgColor: string
  fullWidth?: boolean
  onClick: () => void
}) => {
  const width = fullWidth ? "w-full" : "w-60"

  return (
    <button
      className={`relative h-16 ${width} ${bgColor} text-45 font-bold text-bg transition duration-300 hover:bg-te disabled:pointer-events-none disabled:bg-bg2 disabled:text-te2`}
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
  fullWidth?: boolean
  onClick: () => Promise<void>
}
