import React from "react"
import { CopyToClipboard } from "react-copy-to-clipboard"
import myalgo from "../images/svg/myalgo.svg"
// import checkmark from "../images/svg/checkmark.svg";

const CopyPasteText = ({
  notification,
  text,
  copyText: copyTextOpt,
  copyMsg,
}) => {
  return (
    <CopyPasteHtml
      element={<div className="grey-190">{text}</div>}
      copyText={copyTextOpt ?? text}
      notification={notification}
      copyMsg={copyMsg}
    />
  )
}

export default CopyPasteText

export const CopyPasteHtml = ({ notification, element, copyText, copyMsg }) => {
  //   const [isCopied, _setIsCopied] = useState(false);
  const isCopied = false

  const onCopy = () => {
    if (copyMsg) {
      notification.success(copyMsg, true)
    }
  }

  return (
    <CopyToClipboard text={copyText} onCopy={onCopy}>
      <div className="clickable ft-size-18 d-flex gap-18">
        {element}
        {/* <span className="ft-weight-600">{isCopied ? "Copied!" : null}</span> */}
        <span className={`copy ${isCopied ? "active" : ""}`}>
          {isCopied ? (
            // <img className="clickable" src={checkmark.src} alt="checkmark" />
            <img className="clickable" src={myalgo.src} alt="myalgo" />
          ) : (
            <img className="clickable" src={myalgo.src} alt="myalgo" />
          )}
        </span>
      </div>
    </CopyToClipboard>
  )
}

export const CopyPasteCompleteText = ({ text, copyText: copyTextOpt }) => {
  return (
    <CopyPasteCompleteHtml
      element={<div className="grey-190">{text}</div>}
      copyText={copyTextOpt ?? text}
    />
  )
}

export const CopyPasteCompleteHtml = ({ element, copyText }) => {
  return (
    <CopyToClipboard text={copyText}>
      <div className="clickable ft-size-18 d-flex gap-18">
        <span>{element}</span>
      </div>
    </CopyToClipboard>
  )
}
