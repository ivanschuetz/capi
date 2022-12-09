import ReactTooltip from "react-tooltip"
import { FundsActivityViewData } from "wasm/wasm"
import { Deps } from "../context/AppContext"
import funds from "../images/funds.svg"
import SvgArrowDown from "./icons/SvgArrowDown"
import SvgArrowUp from "./icons/SvgArrowUp"

export const FundsActivityEntry = ({
  deps,
  entry,
}: {
  deps: Deps
  entry: FundsActivityViewData
}) => {
  if (deps.size?.s4) {
    return <TabletEntryView entry={entry} />
  } else {
    return <DesktopEntryView entry={entry} />
  }
}

const DesktopEntryView = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className="mb-8 flex justify-between border border-solid border-ne3 p-6">
      {/* center arrow internally so justify-between works in right column (date at top edge and link at bottom edge) */}
      <div className="center-children mr-4">
        <Arrow entry={entry} addClass="w-14 h-14" />
      </div>
      <AmountView entry={entry} widthClass={"w-48"} />
      <div className="mr-2 grow basis-0">
        <AddressRow entry={entry} />
        <div className="shrink-3 mb-5 w-full text-45 text-ne4 sm:mb-0 sm:w-auto">
          {entry.description}
        </div>
      </div>
      <DetailsLink entry={entry} />
    </div>
  )
}

const AddressRow = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className="align-center mb-3 flex">
      <div className="text-50 font-bold text-te">{entry.address}</div>
      <div className="mx-6 h-2 w-2 rounded-full bg-ne2"></div>
      <div className="grey-190 text-40 ">{fundsActivityEntryLabel(entry)}</div>
    </div>
  )
}

const TabletEntryView = ({ entry }) => {
  return (
    <div className="mb-6 flex gap-4 border border-solid border-ne3 p-5">
      <Arrow entry={entry} addClass="w-12 h-12" />
      <div className="flex flex-grow flex-col">
        <div className="text-50 font-bold text-te">{entry.address}</div>
        <div className="flex flex-row items-center gap-4">
          <AmountView entry={entry} widthClass={"w-24"} />
          <div className="">{fundsActivityEntryLabel(entry)}</div>
        </div>
        <div className="mr-5 text-40 text-te">{entry.description}</div>
      </div>
      <DetailsLink entry={entry} />
    </div>
  )
}

const DetailsLink = ({ entry }: { entry: FundsActivityViewData }) => {
  return (
    <div className={`flex flex-shrink-0 flex-col justify-between text-right`}>
      <div className="text-te2">{entry.date}</div>
      <a
        href={entry.tx_link}
        target="_blank"
        rel="noreferrer"
        className="font-semibold text-pr underline-offset-2"
      >
        {"Details"}
      </a>
    </div>
  )
}

export const fundsActivityEntryLabel = (entry: FundsActivityViewData) => {
  if (entry.is_income === "true") {
    return "Income"
  } else {
    return "Withdrawal"
  }
}

const AmountView = ({
  entry,
  widthClass,
}: {
  entry: FundsActivityViewData
  widthClass: string
}) => {
  return (
    <div className={`flex ${widthClass} items-center`}>
      <img className="mr-2 h-6 w-6" src={funds.src} alt="funds" />
      <div className={"text-60 font-bold text-te"}>{amountTextView(entry)}</div>
    </div>
  )
}

export const amountTextView = (entry: FundsActivityViewData) => {
  // show tooltip if the displayed amount was shortened
  if (entry.amount_without_fee !== entry.short_amount_without_fee) {
    return (
      <>
        <div data-tip={entry.amount_without_fee}>
          {entry.short_amount_without_fee}
        </div>
        <ReactTooltip uuid={"nestedamount" + entry.amount_without_fee} />
      </>
    )
  } else {
    return entry.short_amount_without_fee
  }
}

const Arrow = ({
  entry,
  addClass,
}: {
  entry: FundsActivityViewData
  addClass: string
}) => {
  if (entry.is_income === "true") {
    return <SvgArrowUp className={`fill-sec ${addClass} flex-shrink-0`} />
  } else {
    return <SvgArrowDown className={`fill-pr ${addClass} flex-shrink-0`} />
  }
}
