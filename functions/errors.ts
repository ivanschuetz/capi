// TODO: use this (in error handling of all wasm calls - after specific errors have been handled)
// not doing it yet, because we don't have a mechanism to report errors
// and it's better if testers see the complete error in the notification, instead of just "unknown error"
export const toDefaultErrorMsg = (e: any): string | null => {
  switch (e.type_) {
    case "internal":
    case "msg":
      // developer oriented errors
      // note: e.details has text for debugging / reporting
      return unknownErroMsg
    case "not_enough_algos":
    case "not_enough_funds_asset":
    case "validation":
    case "validations":
    default:
      // either a case was forgotten, or the error isn't meant to have a general message / show a notification
      // (e.g. we ask the user to do something, like buying algos or correcting input errors)
      console.error(
        "Not supported default error: %o. Showing unknown error.",
        e
      )
      return unknownErroMsg
  }
}

const unknownErroMsg = "Unknown error"
