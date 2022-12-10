import { useCallback, useEffect, useMemo, useState } from "react"
import { Deps, HolderEntryViewData } from "../context/AppContext"
import { changeArrow, pieChartColors } from "../functions/utils"
import { HolderEntry, HolderEntryBody } from "./HolderEntry"
import { SharesDistributionChart } from "./SharesDistributionChart"
import { LabeledBox } from "./LabeledBox"
import Progress from "./Progress"
import { SetBool } from "../type_alias"
import { QuantityChangeJs } from "wasm"

const entries_small_count = 3

// Currently contains only a labeled chart but later could contain also e.g. list of holders / top holders
export const SharesDistributionBox = ({ deps }: { deps: Deps }) => {
  const [showMoreSelected, setShowMoreSelected] = useState(false)
  // used to highlight the address on the right side
  const [selectedAddress, setSelectedAddress] = useState(null)

  /// Distribution that's not "not owned", i.e. owned by someone
  /// needed for the views where "not owned" is not used
  const ownedSharesDistr: HolderEntryViewData[] | null = useMemo(() => {
    if (deps.sharesDistr) {
      return deps.sharesDistr?.filter((entry) => entry.type_ !== "not_owned")
    }
  }, [deps.sharesDistr])

  const [entries, setEntries] = useState<HolderEntryViewData[] | null>(
    ownedSharesDistr
  )

  updateSharesDistr(deps)
  updateEntries(
    deps,
    ownedSharesDistr,
    showMoreSelected,
    selectedAddress,
    setEntries
  )

  const colors: string[] = useMemo(() => {
    return pieChartColors()
  }, [])

  const onAddressSelected = useCallback(
    // returns whether the address is now selected
    (address: string): boolean => {
      const addressIndex = ownedSharesDistr.findIndex(
        (d) => d.address === address
      )
      // toggle selected state
      let newSelected = !ownedSharesDistr[addressIndex].isSelected

      // clear selection
      ownedSharesDistr.forEach((share) => (share.isSelected = false))
      ownedSharesDistr[addressIndex].isSelected = newSelected

      // set selected address (for address list) - if it was deselected, it's cleared
      const selection = newSelected ? address : null
      setSelectedAddress(selection)

      return newSelected
    },
    [ownedSharesDistr, setSelectedAddress]
  )

  const content = () => {
    if (entries === null) {
      return <Progress />
    } else {
      return (
        <LabeledBox label={"Investor distribution"}>
          <div className="flex max-w-4xl justify-between">
            <div className="d-flex flex-column">
              <TotalAndAvailableShares deps={deps} />

              <div className="d-none d-tablet-block">
                <HoldersListItems
                  deps={deps}
                  ownedSharesDistr={ownedSharesDistr}
                  entries={entries}
                  selectedAddress={selectedAddress}
                  showMoreSelected={showMoreSelected}
                  setShowMoreSelected={setShowMoreSelected}
                  colors={colors}
                />
              </div>
            </div>
            <div className="pie_chart__container">
              <SharesDistributionChart
                sharesDistr={deps.sharesDistr}
                onAddressSelected={onAddressSelected}
                colors={colors}
                animated={true}
              />
            </div>
            <div className="d-tablet-none">
              <HoldersListItems
                deps={deps}
                ownedSharesDistr={ownedSharesDistr}
                entries={entries}
                selectedAddress={selectedAddress}
                showMoreSelected={showMoreSelected}
                setShowMoreSelected={setShowMoreSelected}
                colors={colors}
              />
            </div>
          </div>
        </LabeledBox>
      )
    }
  }

  return (
    <div className="mt-20" id="investors-distribution">
      {content()}
    </div>
  )
}

const TotalAndAvailableShares = ({ deps }: { deps: Deps }) => {
  return (
    <div className="d-flex flex-column flex-wrap">
      <SubtitleWithCount
        title={"Total shares"}
        number={deps.dao.share_supply}
      />
      <NotOwnedShares deps={deps} />
    </div>
  )
}

const NotOwnedShares = ({ deps }: { deps: Deps }) => {
  return (
    <HolderEntryBody
      amount={deps.notOwnedShares}
      label={"Available for sale"}
      isSelected={false}
      // ne3 theme color
      color={"#e7e7f1"}
    />
  )
}

const SubtitleWithCount = ({
  title,
  number,
  change,
}: {
  title: string
  number: string
  change?: QuantityChangeJs
}) => {
  return (
    <div className="mb-8 flex items-center">
      <span className="nowrap mr-3 text-50 font-bold text-te">{title}</span>
      <span className="mr-3 text-60 font-bold text-te">{number}</span>
      <div>{changeArrow(change)}</div>
    </div>
  )
}

const HoldersListItems = ({
  deps,
  ownedSharesDistr,
  entries,
  selectedAddress,
  showMoreSelected,
  setShowMoreSelected,
  colors,
}: HoldersListItemsPars) => {
  const color = (index: number): string => {
    return colors[Math.round(index % colors.length)]
  }

  if (ownedSharesDistr && entries) {
    return (
      <div className="holder_list_container">
        <SubtitleWithCount
          title={"Investors"}
          number={ownedSharesDistr.length + ""}
          change={deps.holdersChange}
        />
        {entries.map((entry) => {
          // not owned is shown on the left side, so we remove the entry from the list here
          // note that we keep it in the original list, because it's also used for the chart, where we show not owned
          if (entry.type_ === "not_owned") {
            return null
          } else {
            return (
              <HolderEntry
                key={entry.label}
                entry={entry}
                isSelected={entry.address === selectedAddress}
                // use original index (not filtered holders) to get chart segment color
                col={color(entry.originalIndex)}
              />
            )
          }
        })}
        <ShowMoreOrLessFooter
          ownedSharesDistr={ownedSharesDistr}
          showMoreSelected={showMoreSelected}
          setShowMoreSelected={setShowMoreSelected}
        />
      </div>
    )
  } else {
    return null
  }
}

type HoldersListItemsPars = {
  deps: Deps
  ownedSharesDistr: HolderEntryViewData[]
  entries: HolderEntryViewData[]
  selectedAddress: string
  showMoreSelected: boolean
  setShowMoreSelected: SetBool
  colors: string[]
}

const ShowMoreOrLessFooter = ({
  ownedSharesDistr,
  showMoreSelected,
  setShowMoreSelected,
}: {
  ownedSharesDistr: HolderEntryViewData[]
  showMoreSelected: boolean
  setShowMoreSelected: SetBool
}) => {
  // not enough entries for collapsing: no footer needed
  if (ownedSharesDistr && ownedSharesDistr.length <= entries_small_count) {
    return null
  }

  // since we discarded not enough entries case, showMore: true -> "show more", showMore: false -> "show less"
  let showMore = !showMoreSelected
  return (
    <button
      className="w-full text-45 font-bold text-pr"
      onClick={() => setShowMoreSelected(showMore)}
    >
      {showMore ? "See all" : "Show less"}
    </button>
  )
}

const updateSharesDistr = (deps: Deps) => {
  useEffect(() => {
    ;(async () => {
      if (deps.dao) {
        deps.updateSharesDistr.call(null, deps.dao)
      }
    })()
  }, [deps.updateSharesDistr, deps.notification, deps.dao])
}

const updateEntries = (
  deps: Deps,
  ownedSharesDistr: HolderEntryViewData[],
  showMoreSelected: boolean,
  selectedAddress: string,
  setEntries: (entries: HolderEntryViewData[]) => void
) => {
  useEffect(() => {
    const showAll = (): boolean => {
      return (
        showMoreSelected ||
        (ownedSharesDistr && ownedSharesDistr.length <= entries_small_count)
      )
    }

    const filterHolders = (startIndex: number): HolderEntryViewData[] => {
      if (!ownedSharesDistr) return null

      let min = Math.min(ownedSharesDistr.length, entries_small_count)
      const holders = ownedSharesDistr.slice(startIndex, startIndex + min)
      return holders
    }

    if (showAll()) {
      setEntries(ownedSharesDistr)
    } else {
      // collapsed
      var startIndex = 0
      if (selectedAddress) {
        startIndex = ownedSharesDistr.findIndex(
          (d) => d.address === selectedAddress
        )
      }
      setEntries(filterHolders(startIndex))
    }
  }, [
    deps.notification,
    deps.dao.shares_asset_id,
    ownedSharesDistr,
    showMoreSelected,
    selectedAddress,
  ])
}
