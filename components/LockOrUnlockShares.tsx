import React, { useState } from "react"
import { SubmitButton } from "./SubmitButton"
import { SharesDistributionChart } from "../shares_distribution_chart/SharesDistributionChart"
import { LabeledAmountInput, WithTooltip } from "./labeled_inputs"
import { pieChartColors } from "../functions/utils"
import redArrow from "../images/svg/arrow.svg"
import dark_cyan_circle from "../images/dark_cyan_circle.svg"
import light_cyan_circle from "../images/light_cyan_circle.svg"

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
}) => {
  const [input, setInput] = useState(null)
  const [inputError, setInputError] = useState(null)

  const submitButton = () => {
    return (
      <SubmitButton
        label={buttonLabel}
        disabled={dao.funds_raised === "false"}
        className="button-primary"
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
      <div className="shares-box box-container">
        <div className="shares-amount">
          <div className="available-shares">
            <div>
              <div className="title">{title}</div>
              <div className="mb-16 flex-block align-center">
                <div className="desc">{"Share supply"}</div>
                <div className="subtitle black">{dao.share_supply}</div>
                <div className="arrow-container">
                  <img src={redArrow.src} alt="redArrow" />
                </div>
              </div>
              <div className="chartBlock ">
                <div className="numbers desc">
                  {investmentData.investor_locked_shares}
                </div>
                <div className="h-16px">
                  <img src={dark_cyan_circle.src} alt="" />
                </div>
                <div>{"Your locked shares"}</div>
              </div>
              <div className="chartBlock">
                <div className="numbers desc">
                  {investmentData.investor_unlocked_shares}
                </div>
                <div className="h-16px">
                  <img src={light_cyan_circle.src} alt="" />
                </div>
                <div>{"Your unlocked shares"}</div>
              </div>
            </div>
            <div className="shares-chart d-desktop-none">
              <SharesDistributionChart
                sharesDistr={[
                  to_pie_chart_slice(investmentData.investor_locked_shares),
                  to_pie_chart_slice(investmentData.investor_unlocked_shares),
                ]}
                col={pieChartColors()}
                animated={false}
                disableClick={true}
              />
            </div>
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
        </div>
        <div className="shares-chart d-tablet-mobile-none">
          <SharesDistributionChart
            sharesDistr={[
              to_pie_chart_slice(investmentData.investor_locked_shares),
              to_pie_chart_slice(investmentData.investor_unlocked_shares),
            ]}
            col={pieChartColors()}
            animated={false}
            disableClick={true}
          />
        </div>
      </div>
    )
  }

  return <div>{dao && investmentData && view()}</div>
}

const to_pie_chart_slice = (percentage) => {
  return { percentage_number: percentage }
}
