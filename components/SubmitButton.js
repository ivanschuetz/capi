export const SubmitButton = ({
  label,
  disabled,
  isLoading,
  className,
  onClick,
}) => {
  return (
    <button
      className={`position-relative ${className}`}
      disabled={disabled}
      onClick={async () => {
        onClick();
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
  );
};
