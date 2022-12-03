import {
  AddTeamMemberInputErrors,
  CreateAssetsInputErrors,
  FrError,
  ValidateUpateDataInputErrors,
  ValidationError,
} from "wasm/wasm"

// and it's better if testers see the complete error in the notification, instead of just "unknown error"
// note that error returned from here might be further transformed in the notification (to "friendly" message)
// we do it there because we used to have functionality there to show friendly msg + copy button to copy paste complete msg
// this might need to be redesigned
export const toDefaultErrorMsg = (e: FrError): string => {
  if (isInternalError(e)) {
    return e.internal
  } else if (isMsgError(e)) {
    return e.msg
  } else {
    // a case was forgotten, or the error isn't meant to have a general message / show a notification
    // (e.g. we ask the user to do something, like buying algos or correcting input errors)
    console.error("Not supported default error: %o. Showing unknown error.", e)
    return unknownErroMsg
  }
}

export const isFrError = (value: any): value is FrError => {
  return (
    isNotEnoughAlgosError(value) ||
    isNotEnoughFundsAssetError(value) ||
    isValidationError(value) ||
    isCreateDaoValidationsError(value) ||
    isUpdateDaoDataValidationsError(value) ||
    isValidationsError(value) ||
    isInternalError(value) ||
    isMsgError(value)
  )
}

export const isNotEnoughAlgosError = (
  value: FrError
): value is { internal: string } => {
  return value.hasOwnProperty("notEnoughAlgos")
}

export const isNotEnoughFundsAssetError = (
  value: FrError
): value is { notEnoughFundsAsset: { to_buy: string } } => {
  return value.hasOwnProperty("notEnoughFundsAsset")
}

export const isValidationError = (
  value: FrError
): value is { validation: ValidationError } => {
  return value.hasOwnProperty("validation")
}

export const isCreateDaoValidationsError = (
  value: FrError
): value is { createDaoValidations: CreateAssetsInputErrors } => {
  return value.hasOwnProperty("createDaoValidations")
}

export const isUpdateDaoDataValidationsError = (
  value: FrError
): value is { updateDaoDataValidations: ValidateUpateDataInputErrors } => {
  return value.hasOwnProperty("updateDaoDataValidations")
}

export const isAddTeamMemberValidationsError = (
  value: FrError
): value is { addTeamMemberValidations: AddTeamMemberInputErrors } => {
  return value.hasOwnProperty("addTeamMemberValidations")
}

export const isValidationsError = (
  value: FrError
): value is { validations: Record<string, ValidationError> } => {
  return value.hasOwnProperty("validations")
}

const isInternalError = (value: FrError): value is { internal: string } => {
  return value.hasOwnProperty("internal")
}

const isMsgError = (value: FrError): value is { msg: string } => {
  return value.hasOwnProperty("msg")
}

const unknownErroMsg = "Unknown error"
