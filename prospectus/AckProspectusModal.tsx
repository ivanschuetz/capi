import { useState } from "react"
import { SubmitButton, TextButton } from "../components/SubmitButton"
import { Deps } from "../context/AppContext"
import Modal from "../modal/Modal"
import { AckProspectusView } from "./AckProspectusView"

type PdfPageState = "first" | "between" | "last"

export const AckProspectusModal = ({
  deps,
  onAccept,
  closeModal,
}: {
  deps: Deps
  onAccept: () => void
  closeModal: () => void
}) => {
  const [pdfPageState, setPdfPageState] = useState<PdfPageState | null>(null)
  const [pageNumber, setPageNumber] = useState(1)
  const [pageCount, setPageCount] = useState<number | null>(null)

  const updatePageNumber = (n: number) => {
    setPageNumber(n)
    setPdfPageState(toPdfPageState(n, pageCount))
  }

  const back = () => {
    updatePageNumber(pageNumber - 1)
  }

  const next = () => {
    updatePageNumber(pageNumber + 1)
  }

  return (
    <Modal
      title={"Invest in " + deps.dao.name}
      onClose={() => handleCancel(back, closeModal, pdfPageState)}
    >
      <AckProspectusView
        deps={deps}
        url={deps.dao.prospectus.url}
        hash={deps.dao.prospectus.hash}
        pageNumber={pageNumber}
        onPageCount={(pageCount) => {
          setPageCount(pageCount)
          setPdfPageState(toPdfPageState(pageNumber, pageCount))
        }}
      />
      <div>
        <div className="d-flex gap-40">
          <TextButton
            label={toCancelLabel(pdfPageState)}
            onClick={async () => handleCancel(back, closeModal, pdfPageState)}
          />
          <SubmitButton
            label={toOkLabel(pdfPageState)}
            width="w-auto"
            onClick={async () => handleOk(next, onAccept, pdfPageState)}
          />
        </div>
      </div>
    </Modal>
  )
}

// TODO handle pagestate === null -> also, why is ts allowing this?
const handleCancel = (
  back: () => void,
  closeModal: () => void,
  pageState?: PdfPageState
) => {
  // if we don't have a state, just close the modal
  if (!pageState) {
    closeModal()
  }

  switch (pageState) {
    case "first":
      return closeModal()
    case "between":
    case "last":
      return back()
  }
}

const handleOk = (
  next: () => void,
  submit: () => void,
  pageState?: PdfPageState
) => {
  if (!pageState) {
    // TODO think about this - currently it's not impossible to click ok if there's no page state
    // there's no page state e.g. when the pdf couldn't be loaded (e.g. IPFS not working)
    console.error("Invalid state: clicking ok but there's no page state")
  }

  switch (pageState) {
    case "first":
    case "between":
      return next()
    case "last":
      return submit()
  }
}

const toOkLabel = (pageState: PdfPageState) => {
  console.log("in toOkLabel, page state: %o: ", pageState)

  switch (pageState) {
    case "first":
    case "between":
      return "Next"
    case "last":
      return "Accept"
  }
}

const toCancelLabel = (pageState: PdfPageState) => {
  switch (pageState) {
    case "first":
      return "Cancel"
    case "between":
    case "last":
      return "Back"
  }
}

const toPdfPageState = (current: number, pageCount: number): PdfPageState => {
  if (current < 0 || current > pageCount) {
    throw Error("Invalid current page number: " + current)
  }
  console.log(
    "to pdf page state: current page: %o pageCount: %o",
    current,
    pageCount
  )
  if (current === pageCount) {
    return "last"
  } else if (current === 1) {
    return "first"
  } else {
    return "between"
  }
}
