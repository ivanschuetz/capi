import { Deps } from "../context/AppContext"
import { OkCancelModal } from "../modal/OkCancelModal"
import { AckProspectusView } from "./AckProspectusView"

export const AckProspectusModal = ({
  deps,
  onAccept,
  closeModal,
}: {
  deps: Deps
  onAccept: () => void
  closeModal: () => void
}) => {
  return (
    <OkCancelModal
      title={"Invest in " + deps.dao.name}
      closeModal={closeModal}
      okLabel={"Acknowledge"}
      onSubmit={() => onAccept()}
    >
      <AckProspectusView
        deps={deps}
        url={deps.dao.prospectus.url}
        hash={deps.dao.prospectus.hash}
      />
    </OkCancelModal>
  )
}
