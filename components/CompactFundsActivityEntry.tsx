import { FundsActivityViewData } from "wasm"
import funds from "../images/funds.svg"
import { fundsActivityEntryLabel, amountTextView } from "./FundsActivityEntry"
import SvgArrowDown from "./icons/SvgArrowDown"
import SvgArrowUp from "./icons/SvgArrowUp"

export const CompactFundsActivityEntry = ({
  entry,
}: {
  entry: FundsActivityViewData
}) => {
  return (
    <div className="relative mb-8 flex items-center justify-start gap-4">
      <MaybeBigScreensArrow entry={entry} />
      <AddressAndAmount entry={entry} />
      <DateAndLink entry={entry} />
    </div>
  )
}

const AmountViewNumberRow = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className="flex items-center">
      <MaybeSmallScreensArrow entry={entry} />
      <img
        className="opacity-50"
        width="16px"
        height="16px"
        src={funds.src}
        alt="funds"
      />

      <div className="ml-1 text-45 font-bold text-te">
        {amountTextView(entry)}
      </div>
      <div className="ml-4 text-40 text-te2">
        {fundsActivityEntryLabel(entry)}
      </div>
    </div>
  )
}

const AddressAndAmount = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className="flex flex-col justify-between md:gap-1">
      <div className="text-50 font-medium text-ne4">{entry.address}</div>
      <AmountViewNumberRow entry={entry} />
    </div>
  )
}

const DateAndLink = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className="ml-0 flex flex-grow flex-col md:ml-4 md:gap-1">
      <div className="whitespace-nowrap text-right text-35 text-te2 xl:text-36">
        {entry.date}
      </div>
      <a
        className="text-right font-semibold text-pr underline underline-offset-4"
        href={entry.tx_link}
        target="_blank"
        rel="noreferrer"
      >
        {"Details"}
      </a>
    </div>
  )
}

// shows on big screen
const MaybeBigScreensArrow = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className="hidden h-8 w-8 md:block">
      <ArrowUpOrDown entry={entry} sizeClasses="w-8 h-8" />
    </div>
  )
}

// shows on small screen
const MaybeSmallScreensArrow = ({
  entry,
}: {
  entry: FundsActivityViewData
}) => {
  return (
    <div className="md:hidden">
      <ArrowUpOrDown entry={entry} sizeClasses="w-4 h-4 mr-1" />
    </div>
  )
}

const ArrowUpOrDown = ({
  entry,
  sizeClasses,
}: {
  entry: FundsActivityViewData
  sizeClasses: string
}) => {
  if (entry.is_income === "true") {
    return <SvgArrowUp className={`fill-sec ${sizeClasses}`} />
  } else {
    return <SvgArrowDown className={`fill-pr ${sizeClasses}`} />
  }
}
