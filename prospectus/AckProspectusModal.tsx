import { useState } from "react"
import { Deps } from "../context/AppContext"
import { OkCancelModal } from "../modal/OkCancelModal"
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
    <OkCancelModal
      title={"Invest in " + deps.dao.name}
      okLabel={toOkLabel(pdfPageState)}
      cancelLabel={toCancelLabel(pdfPageState)}
      onCancel={() => {
        handleCancel(back, closeModal, pdfPageState)
      }}
      onSubmit={() => handleOk(next, onAccept, pdfPageState)}
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
    </OkCancelModal>
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

  if (current === 1) {
    return "first"
  } else if (current === pageCount) {
    return "last"
  } else {
    return "between"
  }
}
