import { HolderEntryViewData } from "../context/AppContext"

export const HolderEntry = ({
  entry,
  isSelected,
  col,
}: {
  entry: HolderEntryViewData
  isSelected: boolean
  col?: string
}) => {
  if (entry.type_ === "holder") {
    return holderEntry(entry, isSelected, col)
  } else if (entry.type_ === "not_owned") {
    return notOwnedEntry(entry, isSelected)
  }
}

const holderEntry = (
  entry: HolderEntryViewData,
  isSelected: boolean,
  col?: string
) => {
  return (
    <a href={entry.address_browser_link} target="_blank" rel="noreferrer">
      {entryBody(entry, isSelected, col)}
    </a>
  )
}

const notOwnedEntry = (entry: HolderEntryViewData, isSelected: boolean) => {
  return entryBody(entry, isSelected)
}

const entryBody = (
  entry: HolderEntryViewData,
  isSelected: boolean,
  color?: string
) => {
  return (
    <HolderEntryBody
      amount={entry.percentage_formatted}
      label={entry.label}
      isSelected={isSelected}
      color={color}
    />
  )
}

export const HolderEntryBody = ({
  amount,
  label,
  isSelected,
  color,
}: {
  amount: string
  label: string
  isSelected: boolean
  color?: string
}) => {
  var ngClass = "flex gap-4 items-center mb-2 py-2 "
  if (isSelected) {
    ngClass = ngClass + " selected"
  }
  return (
    <div className={ngClass}>
      <div className="w-14 text-50 font-bold text-te">{amount}</div>
      <svg
        width="16"
        height="17"
        viewBox="0 0 16 17"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <circle cx="8" cy="8.5" r="8" fill={color} />
      </svg>
      <div className="text-45 text-te">{label}</div>
    </div>
  )
}
