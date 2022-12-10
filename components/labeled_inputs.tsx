import moment, { Moment } from "moment"
import { useMemo, useState } from "react"
import { useTextCounter } from "../hooks/useTextCounter"
import calendar from "../images/calendar_today.svg"
import funds from "../images/funds.svg"
import error from "../images/svg/error.svg"
import info from "../images/svg/info.svg"
import { SelectDateModal } from "../modal/SelectDateModal"
import styles from "./labeled_inputs.module.sass"

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
  const containerClass = img ? "relative" : ""

  const {
    remainingChars,
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
      <div className={containerClass}>
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
          hasImage={img}
        />
        {img && <InputLeftImg img={img} />}
      </div>
    </WithLabelAndLength>
  )
}

export const InputLeftImg = ({ img }: { img: any }) => {
  return (
    <div className="center-children absolute top-0 left-0 h-16 pl-6">
      <img src={img.src} alt="img" />
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
      <div className="flex items-center" data-tip={text}>
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
      <div className="relative">
        <Input
          value={inputValue}
          type={"number"}
          onChange={onChange}
          placeholder={placeholder}
          hasImage={true}
        />
        <InputLeftImg img={funds} />
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
}: LabeledAmountInputPars) => {
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
    <div>
      <Label text={label} info={info} />
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
    <div className="mb-6 sm:mb-8">
      <div>
        <div className="flex">
          <Label text={label} info={info} />
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

export const Label = ({ text, info }: { text: string; info: string }) => {
  return (
    <div className="mb-1 flex grow items-center gap-2">
      <div className="text-te">{text}</div>
      {info && <InfoView text={info} />}
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
  hasImage,
}: InputPars) => {
  const paddingLeft = hasImage ? "pl-14" : "pl-5"

  return (
    <input
      className={`h-16 w-full bg-bg2 pr-5 ${paddingLeft} mb-8 pr-5 text-te`}
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
  rows = 10,
}: LabeledTextAreaPars) => {
  const {
    remainingChars,
    inputErrorClass,
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
      <div className={`${img ? "relative" : ""}`}>
        <textarea
          className={`w-full bg-bg2 py-5 px-6 text-te ${inputErrorClass}`}
          rows={rows}
          cols={50}
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
        {img && <InputLeftImg img={img} />}
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
        <div className="relative">
          <Input
            value={formattedMinRaiseTargetEndDate}
            type={"text"}
            placeholder={placeholder}
            disabled={disabled}
            hasImage={true}
          />
          <InputLeftImg img={calendar} />
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

type InputBase = {
  label: string
  inputValue?: string
  onChange: (text: string) => void
  placeholder?: string
  errorMsg?: string
}

type LabeledInputPars = InputBase & {
  img?: any
  maxLength?: number
  info?: string
  disabled?: boolean
}

type InputLengthPars = {
  remainingChars: number
  className: string
}

type LabeledCurrencyInputPars = LabeledAmountInputPars

type LabeledAmountInputPars = {
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
  hasImage?: boolean
}

type LabeledTextAreaPars = InputBase & {
  img?: any
  maxLength?: number
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
