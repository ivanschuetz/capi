import { Deps } from "../context/AppContext"
import { safe } from "../functions/utils"

export const startBuyCurrencyFlow = async (
  deps: Deps,
  dstCurrency,
  dstAmount,
  closeModal
) => {
  const reserveWyreRes = await deps.wasm
    .reserveWyre({
      address: deps.myAddress,
      dst_currency: dstCurrency,
      dst_amount: dstAmount,
    })
    .catch(deps.notification.error)

  // TODO return only reservation in rust - we don't use url
  openWyreCheckoutDialog(deps, reserveWyreRes.reservation, closeModal)
}

// see https://docs.sendwyre.com/docs/checkout-hosted-dialog
const openWyreCheckoutDialog = (deps: Deps, reservation, closeModal) => {
  const Wyre = window.Wyre

  // debit card popup
  // note: currently lists credit / debit and Apple Pay on Safari
  var widget = new Wyre({
    env: "test",
    reservation: reservation,
    // A reservation id is mandatory. In order for the widget to open properly you must use a new, unexpired reservation id.
    // Reservation ids are only valid for 1 hour. A new reservation must also be made if a transaction fails.
    operation: {
      type: "debitcard-hosted-dialog",
    },
  })

  widget.on("paymentSuccess", function (e) {
    console.log("paymentSuccess", e)
    deps.notification.success("Account funded")
    // note that we don't refresh the view as it doesn't show algos
    // will do when we buy stables
  })

  widget.open()
  closeModal()
}
