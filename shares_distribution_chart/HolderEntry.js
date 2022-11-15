import React from "react";

export const HolderEntry = ({ entry, isSelected, col }) => {
  if (entry.type_ === "holder") {
    return holderEntry(entry, isSelected, col);
  } else if (entry.type_ === "not_owned") {
    return notOwnedEntry(entry, isSelected);
  }
};

const holderEntry = (entry, isSelected, col) => {
  return (
    <a href={entry.address_browser_link} target="_blank" rel="noreferrer">
      {entryBody(entry, isSelected, col)}
    </a>
  );
};

const notOwnedEntry = (entry, isSelected) => {
  return entryBody(entry, isSelected);
};

const entryBody = (entry, isSelected, col) => {
  var containerClasses = "holder_item__container";
  if (isSelected) {
    containerClasses = containerClasses + " selected";
  }
  return (
    <div className={containerClasses}>
      <div className="w-55px grey-190 desc">{entry.percentage_formatted}</div>
      <div className="h-16px">
        <svg
          width="16"
          height="17"
          viewBox="0 0 16 17"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="8" cy="8.5" r="8" fill={col} />
        </svg>
      </div>
      <div className="grey-190">{entry.label}</div>
    </div>
  );
};
