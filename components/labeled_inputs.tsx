import React, { useState, useEffect, useMemo } from "react"
import ReactTooltip from "react-tooltip"
import moment, { Moment } from "moment"
import { SelectDateModal } from "../modal/SelectDateModal"
import info from "../images/svg/info.svg"
import error from "../images/svg/error.svg"
import funds from "../images/funds.svg"
import calendar from "../images/calendar_today.svg"

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
  const [inputLength, setInputLength] = useState(0)
  const [showLength, setShowLength] = useState(false)

  const container_class = img ? "input_with_image__container" : ""

  const remainingChars = useMemo(() => {
    return maxLength - inputLength
  }, [maxLength, inputLength])

  const stateForRemainingChars = useMemo(() => {
    if (remainingChars < 0) {
      return "over"
    } else {
      return "ok"
    }
  }, [remainingChars])

  const inputTextLengthClass = () => {
    if (stateForRemainingChars === "over") {
      return "input-length-error"
    } else {
      return null
    }
  }

  const counterClass = () => {
    if (stateForRemainingChars === "over") {
      return "red-20"
    } else {
      return null
    }
  }

  useEffect(() => {
    setInputLength(inputValue?.length ?? 0)
  }, [inputValue])

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
              className={counterClass()}
            />
          )}
        </div>
      </div>
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
          textLengthClass={inputTextLengthClass()}
        />

        {img && <img src={img.src} alt="img" />}
      </div>
      <ValidationMsg errorMsg={errorMsg} />
    </div>
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
  img,
  info,
}: LabeledCurrencyInputPars) => {
  return (
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView text={info} />}
      </div>
      <div className="input_with_image__container">
        <Input
          value={inputValue}
          type={"number"}
          onChange={onChange}
          placeholder={placeholder}
        />
        <img src={funds.src} alt="img" />
      </div>
      <ValidationMsg errorMsg={errorMsg} />
    </div>
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
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView text={info} />}
      </div>
      <Input
        value={inputValue}
        type={"number"}
        onChange={onChange}
        placeholder={placeholder}
      />
      <ValidationMsg errorMsg={errorMsg} />
    </div>
  )
}

export const ValidationMsg = ({ errorMsg }) => {
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

// TODO refactor common code with LabeledInput
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
  const [inputLength, setInputLength] = useState(0)
  const [showLength, setShowLength] = useState(false)

  const container_class = img ? "textarea_with_image__container" : ""

  const remainingChars = useMemo(() => {
    return maxLength - inputLength
  }, [maxLength, inputLength])

  const stateForRemainingChars = useMemo(() => {
    if (remainingChars < 0) {
      return "over"
    } else {
      return "ok"
    }
  }, [remainingChars])

  const inputTextLengthClass = () => {
    if (stateForRemainingChars === "over") {
      return "input-length-error"
    } else {
      return null
    }
  }

  const counterClass = () => {
    if (stateForRemainingChars === "over") {
      return "red-20"
    } else {
      return null
    }
  }

  useEffect(() => {
    setInputLength(inputValue?.length ?? 0)
  }, [inputValue])

  return (
    <div className={`labeled_input ${className}`}>
      <div className="labeled_input__label d-flex align-center w-94 justify-between">
        {label}
        <div>
          {showLength && maxLength && (
            <InputLength
              remainingChars={remainingChars}
              className={counterClass()}
            />
          )}
        </div>
      </div>
      <div className="labeled_input__error">{errorMsg}</div>
      <div className={container_class}>
        <textarea
          className={inputTextLengthClass()}
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
    </div>
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
    <div className="labeled_input">
      <div className="labeled_input__label">
        {label}
        {info && <InfoView text={info} />}
      </div>
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
      <ValidationMsg errorMsg={errorMsg} />
      {showMinRaiseTargetEndDateModal && (
        <SelectDateModal
          closeModal={() => setShowMinRaiseTargetEndDateModal(false)}
          endDate={inputValue}
          setEndDate={onChange}
        />
      )}
    </div>
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
