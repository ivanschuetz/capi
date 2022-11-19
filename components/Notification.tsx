import { toFriendlyError } from "../functions/friendlyErrors"
import { toast } from "react-toastify"

export type Notification = {
  success(msg: string): void
  error(msg: string): void
}

export const NotificationCreator: () => Notification = () => ({
  // Display text as a success notification
  success(msg) {
    msg = msg + ""
    console.log(msg)
    toast(msg, {
      toastId: msg,
      type: toast.TYPE.SUCCESS,
      closeOnClick: false,
      position: toast.POSITION.TOP_CENTER,
    })
  },

  // Displays text as error notification,
  // maps to friendly error for certain regexes
  // allows copy paste
  // if friendly error, the copy paste text corresponds to the original (not friendly) text
  // if not friendly error, the copy paste text is equal to the displayed text
  error(msg) {
    var message = msg
    var displayMsg = message

    try {
      const friendlyMsg = toFriendlyError(message)
      if (friendlyMsg) {
        message = friendlyMsg + "\nOriginal error: " + message
        displayMsg = friendlyMsg
      }
    } catch (e) {
      message += "\n+Error mapping to friendly error: " + (e + "")
    }
    console.error("Error notification: %o", message)
    // NOTE that for now msg (which contains the full original error message) isn't included in the notification
    // if user wants to send a report, they've to copy paste from the console
    toast(displayMsg, {
      toastId: displayMsg,
      type: toast.TYPE.ERROR,
      closeOnClick: false,
      position: toast.POSITION.TOP_CENTER,
    })
  },
})
