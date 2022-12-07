import { useState } from "react"
import { pieChartColors } from "../functions/utils"
import dark_cyan_circle from "../images/dark_cyan_circle.svg"
import light_cyan_circle from "../images/light_cyan_circle.svg"
import redArrow from "../images/svg/arrow.svg"
import {
  PieChartPercentageSlice,
  SharesDistributionChart,
} from "./SharesDistributionChart"
import { LabeledAmountInput, WithTooltip } from "./labeled_inputs"
import { SubmitButton } from "./SubmitButton"
import { DaoJs, LoadInvestorResJs } from "wasm/wasm"
import { InteractiveBox } from "./InteractiveBox"
import { ShareSupply } from "./ShareSupply"
import { ChartLabel } from "./ChartLabel"
import { WithPieChartBox } from "./WithPieChartBox"

export const LockOrUnlockShares = ({
  dao,
  investmentData,
  showInput,
  title,
  inputLabel,
  buttonLabel,
  submitting,
  // parameter: input (can be null if there's no input element or input text)
  onSubmit,
}: LockOrUnlockSharesPars) => {
  const [input, setInput] = useState(null)
  const [inputError, setInputError] = useState(null)

  const submitButton = () => {
    return (
      <SubmitButton
        label={buttonLabel}
        disabled={dao.funds_raised === "false"}
        isLoading={submitting}
        onClick={async () => {
          onSubmit(input, setInputError)
        }}
      />
    )
  }

  const submitButtonWithMaybeTooltip = () => {
    const button = submitButton()
    if (dao.funds_raised === "true") {
      return button
    } else if (dao.funds_raised === "false") {
      return (
        <WithTooltip
          text={
            "You can't unlock or lock shares before the funds raising phase is finished"
          }
        >
          {button}
        </WithTooltip>
      )
    } else {
      console.error(
        "Invalid state: funds raised should be true or false: %o",
        dao.funds_raised
      )
      return null
    }
  }

  const view = () => {
    return (
      <WithPieChartBox
        title={title}
        slices={[
          to_pie_chart_slice(investmentData.investor_locked_shares),
          to_pie_chart_slice(investmentData.investor_unlocked_shares),
        ]}
        chartColors={pieChartColors()}
      >
        <>
          <div>
            <ShareSupply supply={dao.share_supply} />
            <ChartLabels investmentData={investmentData} />
          </div>

          <div className="buy-shares-input">
            {showInput && (
              <LabeledAmountInput
                label={inputLabel}
                placeholder={"Enter amount"}
                inputValue={input}
                onChange={setInput}
                errorMsg={inputError}
              />
            )}
            {submitButtonWithMaybeTooltip()}
          </div>
        </>
      </WithPieChartBox>
    )
  }
  return <div>{dao && investmentData && view()}</div>
}

const ChartLabels = ({
  investmentData,
}: {
  investmentData: LoadInvestorResJs
}) => {
  return (
    <>
      <ChartLabel
        number={investmentData.investor_locked_shares}
        circleImg={dark_cyan_circle.src}
        text={"Your locked shares"}
      />
      <ChartLabel
        number={investmentData.investor_unlocked_shares}
        circleImg={light_cyan_circle.src}
        text={"Your unlocked shares"}
      />
    </>
  )
}

const to_pie_chart_slice = (percentage: string): PieChartPercentageSlice => {
  return { percentage_number: percentage, isSelected: false, type_: "" }
}

type LockOrUnlockSharesPars = {
  dao: DaoJs
  investmentData: LoadInvestorResJs
  showInput: boolean
  title: string
  inputLabel?: string
  buttonLabel: string
  submitting: boolean
  onSubmit: (input: string, setErrorMsg: (msg: string) => void) => void
}
