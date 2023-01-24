export const SubmitButton = ({
  label,
  disabled,
  isLoading,
  onClick,
  width,
}: SubmitButtonPars) => {
  return (
    <Button
      label={label}
      disabled={disabled}
      isLoading={isLoading}
      bgColor="bg-pr"
      onClick={onClick}
      width={width}
    />
  )
}

export const TextButton = ({ label, onClick }: SubmitButtonPars) => {
  return (
    <button
      className={`relative h-16 px-5 text-45 font-bold text-pr`}
      onClick={async () => {
        onClick()
      }}
    >
      {label}
    </button>
  )
}

export const CancelButton = ({
  label,
  disabled,
  isLoading,
  onClick,
  width,
}: SubmitButtonPars) => {
  return (
    <Button
      label={label}
      disabled={disabled}
      isLoading={isLoading}
      bgColor="bg-te"
      onClick={onClick}
      width={width}
    />
  )
}

const Button = ({
  label,
  disabled,
  isLoading,
  bgColor,
  onClick,
  width,
}: {
  label: string
  disabled?: boolean
  isLoading?: boolean
  bgColor: string
  width?: string
  onClick: () => void
}) => {
  return (
    <button
      className={`relative h-16 ${width} ${bgColor} px-8 text-45 font-bold text-bg transition hover:bg-te disabled:pointer-events-none disabled:bg-bg2 disabled:text-te2`}
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
  width?: string
  onClick: () => Promise<void>
}
