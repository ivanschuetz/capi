import React, { useEffect, useState, useCallback, useMemo } from "react";
import { SharesDistributionChart } from "../shares_distribution_chart/SharesDistributionChart";
import { LabeledBox } from "../common_comps/LabeledBox";
import { HolderEntry } from "./HolderEntry";
import Progress from "../common_comps/Progress";
import { pieChartColors } from "../common_functions/common";
import { changeArrow } from "../shared_functions";

// Currently contains only a labeled chart but later could contain also e.g. list of holders / top holders
export const SharesDistributionBox = ({ deps }) => {
  const [showMoreSelected, setShowMoreSelected] = useState(false);
  // used to highlight the address on the right side
  const [selectedAddress, setSelectedAddress] = useState(null);

  /// Distribution that's not "not owned", i.e. owned by someone
  /// needed for the views where "not owned" is not used
  const ownedSharesDistr = useMemo(() => {
    if (deps.sharesDistr) {
      return deps.sharesDistr.filter((entry) => entry.type_ !== "not_owned");
    }
  }, [deps.sharesDistr]);

  const [entries, setEntries] = useState(ownedSharesDistr);

  const entries_small_count = 3;

  useEffect(() => {
    async function nestedAsync() {
      if (deps.dao) {
        deps.updateSharesDistr.call(null, deps.dao);
      }
    }
    nestedAsync();
  }, [deps.updateSharesDistr, deps.statusMsg, deps.dao]);

  useEffect(() => {
    const showAll = () => {
      return (
        showMoreSelected ||
        (ownedSharesDistr && ownedSharesDistr.length <= entries_small_count)
      );
    };

    const filterHolders = (startIndex) => {
      if (!ownedSharesDistr) return null;

      let min = Math.min(ownedSharesDistr.length, entries_small_count);
      const holders = ownedSharesDistr.slice(startIndex, startIndex + min);
      return holders;
    };

    if (showAll()) {
      setEntries(ownedSharesDistr);
    } else {
      // collapsed
      var startIndex = 0;
      if (selectedAddress) {
        startIndex = ownedSharesDistr.findIndex(
          (d) => d.address === selectedAddress
        );
      }
      setEntries(filterHolders(startIndex));
    }
  }, [
    deps.statusMsg,
    deps.dao.shares_asset_id,
    ownedSharesDistr,
    showMoreSelected,
    selectedAddress,
  ]);

  const col = useMemo(() => {
    return pieChartColors();
  }, []);

  const color = (index) => {
    return col[Math.round(index % col.length)];
  };

  const onAddressSelected = useCallback(
    (address) => {
      const addressIndex = ownedSharesDistr.findIndex(
        (d) => d.address === address
      );
      // toggle selected state
      let newSelected = !ownedSharesDistr[addressIndex].isSelected;

      // clear selection
      ownedSharesDistr.forEach((share) => (share.isSelected = false));
      ownedSharesDistr[addressIndex].isSelected = newSelected;

      // set selected address (for address list) - if it was deselected, it's cleared
      const selection = newSelected ? address : null;
      setSelectedAddress(selection);

      return newSelected;
    },
    [ownedSharesDistr, setSelectedAddress]
  );

  const showMoreOrLessFooter = () => {
    // not enough entries for collapsing: no footer needed
    if (ownedSharesDistr && ownedSharesDistr.length <= entries_small_count) {
      return null;
    }

    // since we discarded not enough entries case, showMore: true -> "show more", showMore: false -> "show less"
    let showMore = !showMoreSelected;
    return (
      <button
        className="link_button ml-50"
        onClick={() => setShowMoreSelected(showMore)}
      >
        {showMore ? "See all" : "Show less"}
      </button>
    );
  };

  const holdersListItems = () => {
    if (ownedSharesDistr && entries) {
      return (
        <div className="holder_list_container">
          <div className="flexBlock">
            <span className="desc mr-12">{"Investors"}</span>
            <span className="subtitle">{ownedSharesDistr.length}</span>
            <div>{changeArrow(deps.holdersChange)}</div>
          </div>
          {entries.map((entry) => {
            // not owned is shown on the left side, so we remove the entry from the list here
            // note that we keep it in the original list, because it's also used for the chart, where we show not owned
            if (entry.type_ === "not_owned") {
              return null;
            } else {
              return (
                <HolderEntry
                  key={entry.label}
                  entry={entry}
                  isSelected={entry.address === selectedAddress}
                  // use original index (not filtered holders) to get chart segment color
                  col={color(entry.originalIndex)}
                />
              );
            }
          })}
          {showMoreOrLessFooter()}
        </div>
      );
    } else {
      return null;
    }
  };

  const content = () => {
    if (entries === null) {
      return <Progress vCenter={false} />;
    } else {
      return (
        <LabeledBox label={"Investor distribution"}>
          <div className="investors-container">
            <div className="d-flex flex-column">
              <div className="d-flex flex-column flex-wrap">
                <div className="flexBlock">
                  <div className="mr-12 desc nowrap">{"Total shares"}</div>
                  <div className="subtitle">{deps.dao.share_supply}</div>
                  <div className="arrow-container"></div>
                </div>
                <div className="d-flex align-center justify-between-tablet w-100 gap-10">
                  <div className="desc">{deps.notOwnedShares}</div>
                  <div className="circle"></div>
                  <div className="grey-190">{"Available for sale"}</div>
                </div>
              </div>
              <div className="d-none d-tablet-block">{holdersListItems()}</div>
            </div>
            <div className="pie_chart__container">
              <SharesDistributionChart
                sharesDistr={deps.sharesDistr}
                onAddressSelected={onAddressSelected}
                col={col}
                animated={true}
              />
            </div>
            <div className="d-tablet-none">{holdersListItems()}</div>
          </div>
        </LabeledBox>
      );
    }
  };

  return (
    <div className="mt-80" id="investors-distribution">
      {content()}
    </div>
  );
};
