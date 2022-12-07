import moment from "moment"
import { useState } from "react"
import Calendar from "react-calendar"
import { CancelButton, SubmitButton } from "../components/SubmitButton"
import Modal from "./Modal"

// endDate, setEndDate: moment.js date (converted internally to/from regular date for calendar)
export const SelectDateModal = ({ closeModal, endDate, setEndDate }) => {
  const [newEndDate, setNewEndDate] = useState(endDate)

  return (
    <Modal title={"Select end date"} onClose={() => closeModal()}>
      <Calendar
        onChange={(value) => {
          setNewEndDate(moment(value)) // date -> moment
        }}
        value={newEndDate.toDate()} // moment -> date
      />
      <div className="d-flex gap-40">
        <SubmitButton
          label={"Save"}
          onClick={() => {
            setEndDate(newEndDate)
            closeModal()
          }}
        />
        <CancelButton label={"Cancel"} onClick={closeModal} />
      </div>
    </Modal>
  )
}
