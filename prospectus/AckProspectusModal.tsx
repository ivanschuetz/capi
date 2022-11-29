import { OkCancelModal } from "../modal/OkCancelModal"
import { AckProspectusView } from "./AckProspectusView"

export const AckProspectusModal = ({ deps, onAccept, closeModal }) => {
  return (
    <OkCancelModal
      title={"Prospectus"}
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
