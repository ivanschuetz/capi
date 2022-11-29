import { Deps } from "../context/AppContext"
import { OkModal } from "../modal/OkModal"
import { ProspectusView } from "./ProspectusView"

export const ProspectusModal = ({
  deps,
  closeModal,
}: {
  deps: Deps
  closeModal: () => void
}) => {
  return (
    <OkModal title={"Prospectus"} closeModal={closeModal}>
      <ProspectusView
        url={deps.dao.prospectus.url}
        hash={deps.dao.prospectus.hash}
      />
    </OkModal>
  )
}
