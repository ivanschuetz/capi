import moment, { Moment } from "moment"
import { useMemo, useState } from "react"
import { useTextCounter } from "../hooks/useTextCounter"
import calendar from "../images/calendar_today.svg"
import funds from "../images/funds.svg"
import error from "../images/svg/error.svg"
import info from "../images/svg/info.svg"
import { SelectDateModal } from "../modal/SelectDateModal"

export const LabeledInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  maxLength,
  img,
  info,
  disabled,
}: LabeledInputPars) => {
  const container_class = img ? "input_with_image__container" : ""

  const {
    remainingChars,
    inputClass,
    lengthClass,
    showLength,
    setShowLength,
    setInputLength,
  } = useTextCounter(maxLength, inputValue)

  return (
    <WithLabelAndLength
      label={label}
      info={info}
      errorMsg={errorMsg}
      showLength={showLength}
      maxLength={maxLength}
      remainingChars={remainingChars}
      lengthClass={lengthClass}
    >
      <div className={container_class}>
        <Input
          value={inputValue}
          type={"text"}
          onChange={(input) => {
            setInputLength(input.length)
            onChange(input)
          }}
          onFocusToggle={(focus) => {
            setShowLength(focus)
          }}
          placeholder={placeholder}
          disabled={disabled}
          textLengthClass={inputClass}
        />

        {img && <img src={img.src} alt="img" />}
      </div>
    </WithLabelAndLength>
  )
}

export const InfoView = ({ text }: { text: string }) => {
  return (
    <WithTooltip text={text}>
      <img src={info.src} alt="info" />
    </WithTooltip>
  )
}

export const WithTooltip = ({
  text,
  children,
}: {
  text: string
  children: JSX.Element
}) => {
  return (
    <>
      <div className="d-flex align-center" data-tip={text}>
        {children}
      </div>
      {/* <ReactTooltip uuid={"infoview" + text} /> */}
    </>
  )
}
const InputLength = ({ remainingChars, className }: InputLengthPars) => {
  return <div className={className}>{remainingChars}</div>
}

export const LabeledCurrencyInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  info,
}: LabeledCurrencyInputPars) => {
  return (
    <WithLabel label={label} info={info} errorMsg={errorMsg}>
      <div className="input_with_image__container">
        <Input
          value={inputValue}
          type={"number"}
          onChange={onChange}
          placeholder={placeholder}
        />
        <img src={funds.src} alt="img" />
      </div>
    </WithLabel>
  )
}

export const LabeledAmountInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  info,
}) => {
  return (
    <WithLabel label={label} info={info} errorMsg={errorMsg}>
      <Input
        value={inputValue}
        type={"number"}
        onChange={onChange}
        placeholder={placeholder}
      />
    </WithLabel>
  )
}

const WithLabel = ({
  label,
  info,
  errorMsg,
  children,
}: {
  label: string
  info: string
  errorMsg?: string
  children: JSX.Element
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView text={info} />}
      </div>
      {children}
      <ValidationMsg errorMsg={errorMsg} />
    </div>
  )
}

const WithLabelAndLength = ({
  label,
  info,
  errorMsg,
  children,
  showLength,
  maxLength,
  remainingChars,
  lengthClass,
}: {
  label: string
  info?: string
  errorMsg?: string
  children: JSX.Element
  showLength: boolean
  maxLength: number
  remainingChars?: number
  lengthClass?: string
}) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label d-flex align-center w-94 justify-between">
        <div className="d-flex align-center gap-10">
          <div>{label}</div>
          {info && <InfoView text={info} />}
        </div>
        <div>
          {showLength && maxLength && (
            <InputLength
              remainingChars={remainingChars}
              className={lengthClass}
            />
          )}
        </div>
      </div>
      {children}
      <ValidationMsg errorMsg={errorMsg} />
    </div>
  )
}

export const ValidationMsg = ({ errorMsg }: { errorMsg?: string }) => {
  return (
    <div className="labeled_input__error">
      {errorMsg ? <img src={error.src} alt="error" /> : ""}
      {errorMsg}
    </div>
  )
}

// onFocusToggle: optional: pass to be called when the input gains or loses focus
const Input = ({
  value,
  type,
  onChange,
  onFocusToggle,
  placeholder,
  disabled,
  textLengthClass,
}: InputPars) => {
  var className = "label-input-style"
  if (textLengthClass) {
    className += ` ${textLengthClass}`
  }

  return (
    <input
      className={className}
      placeholder={placeholder}
      size={30}
      type={type}
      min="0" // only active if type is number
      value={value}
      disabled={disabled}
      onChange={(event) => {
        onChange(event.target.value)
      }}
      onFocus={(e) => {
        if (onFocusToggle) {
          onFocusToggle(true)
        }
      }}
      onBlur={(e) => {
        if (onFocusToggle) {
          onFocusToggle(false)
        }
      }}
    />
  )
}

export const LabeledTextArea = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  maxLength,
  img,
  className,
  rows = 10,
}: LabeledTextAreaPars) => {
  const container_class = img ? "textarea_with_image__container" : ""

  const {
    remainingChars,
    inputClass,
    lengthClass,
    showLength,
    setShowLength,
    setInputLength,
  } = useTextCounter(maxLength, inputValue)

  return (
    <WithLabelAndLength
      label={label}
      info={null}
      errorMsg={errorMsg}
      showLength={showLength}
      maxLength={maxLength}
      remainingChars={remainingChars}
      lengthClass={lengthClass}
    >
      <div className={container_class}>
        <textarea
          className={inputClass}
          rows={rows}
          cols="50"
          value={inputValue}
          placeholder={placeholder}
          onChange={(event) => {
            const input = event.target.value
            setInputLength(input.length)
            onChange(input)
          }}
          onFocus={(e) => {
            setShowLength(true)
          }}
          onBlur={(e) => {
            setShowLength(false)
          }}
        />
        {img && <img src={img.src} alt="img" />}
      </div>
    </WithLabelAndLength>
  )
}

export const LabeledDateInput = ({
  label,
  inputValue,
  onChange,
  placeholder,
  errorMsg,
  info,
  disabled,
}: LabeledDatePars) => {
  const [showMinRaiseTargetEndDateModal, setShowMinRaiseTargetEndDateModal] =
    useState(false)

  const formattedMinRaiseTargetEndDate = useMemo(() => {
    return moment(inputValue).format("D MMM YYYY")
  }, [inputValue])

  return (
    <>
      <WithLabel label={label} info={info} errorMsg={errorMsg}>
        <div className="date-input__container">
          <Input
            value={formattedMinRaiseTargetEndDate}
            type={"text"}
            placeholder={placeholder}
            disabled={disabled}
          />
          <img
            src={calendar.src}
            alt="img"
            onClick={() => setShowMinRaiseTargetEndDateModal(true)}
          />
        </div>
      </WithLabel>
      {showMinRaiseTargetEndDateModal && (
        <SelectDateModal
          closeModal={() => setShowMinRaiseTargetEndDateModal(false)}
          endDate={inputValue}
          setEndDate={onChange}
        />
      )}
    </>
  )
}

type LabeledInputPars = {
  label: string
  inputValue?: string
  onChange: (text: string) => void
  placeholder?: string
  errorMsg?: string
  maxLength?: number
  img?: any
  info?: string
  disabled?: boolean
}

type InputLengthPars = {
  remainingChars: number
  className: string
}

type LabeledCurrencyInputPars = {
  label: string
  inputValue: string
  onChange: (input: string) => void
  placeholder?: string
  errorMsg?: string
  img?: any
  info?: string
}

type InputPars = {
  value: string
  type: string
  onChange?: (input: string) => void
  onFocusToggle?: (focus: boolean) => void
  placeholder?: string
  disabled?: boolean
  textLengthClass?: string
}

type LabeledTextAreaPars = {
  label: string
  inputValue?: string
  onChange?: (input: string) => void
  placeholder?: string
  errorMsg?: string
  maxLength?: number
  img?: any
  className?: string
  rows?: number
}

type LabeledDatePars = {
  label: string
  inputValue?: Moment
  onChange: (date: Moment) => void
  placeholder?: string
  errorMsg?: string
  info?: string
  disabled?: boolean
}
