import { ValidationError } from "wasm/wasm"

/// validation error -> error message
/// error can be null, meaning that there's no error
/// return is null if there's no message (because there's no error)
export const toValidationErrorMsg = (e?: ValidationError): string | null => {
  // if the (field-specific) error is null, there's no error so there's no error message
  if (!e) {
    return null
  }

  if (e === "empty") {
    return "Please enter something"
  } else if (isMinlength(e)) {
    return (
      "Must have at least " +
      e.minLength.min +
      " characters. Current: " +
      e.minLength.actual
    )
  } else if (isMaxlength(e)) {
    return (
      "Must have less than " +
      e.maxLength.max +
      " characters. Current: " +
      e.maxLength.actual
    )
  } else if (isMin(e)) {
    return "Must be greater than " + e.min.min
  } else if (isMax(e)) {
    return "Must be less than " + e.max.max
  } else if (e === "address") {
    return "Invalid address format"
  } else if (e === "notPositive") {
    return "Please enter a positive amount"
  } else if (e === "notAnInteger") {
    return "Invalid (whole) number format"
  } else if (e === "notTimestamp") {
    return "Invalid date"
  } else if (e === "notADecimal") {
    return "Invalid number format"
  } else if (isTooManyFractionalDigits(e)) {
    return (
      "Must have less than " +
      e.tooManyFractionalDigits.max +
      " fractional digits. Current: " +
      e.tooManyFractionalDigits.actual
    )
  } else if (e === "shareCountLargerThanAvailable") {
    return "Please enter an amount smaller or equal to available shares"
  } else if (e === "mustBeAfterNow") {
    return "Date must be in the future"
  } else if (e === "mustBeLessThanMaxInvestAmount") {
    return "Must be less or equal than max investment"
  } else if (e === "mustBeGreaterThanMinInvestAmount") {
    return "Must be more or equal than min investment"
  } else if (e === "sharesForInvestorsGreaterThanSupply") {
    return "Must be less than or equal to supply"
  } else if (isBuyingLessSharesThanMinAmount(e)) {
    return (
      "The minimum of shares to buy is " + e.buyingLessSharesThanMinAmount.min
    )
  } else if (isBuyingMoreSharesThanMaxTotalAmount(e)) {
    return (
      "You can't own more than " +
      e.buyingMoreSharesThanMaxTotalAmount.max +
      " shares. Currently owned: " +
      e.buyingMoreSharesThanMaxTotalAmount.currently_owned
    )
  } else if (isUnexpected(e)) {
    return "Unexpected error: " + e.unexpected
  } else {
    return "Unexpected error: " + e
  }
}

const isMinlength = (
  value: ValidationError
): value is { minLength: { min: string; actual: string } } => {
  return value.hasOwnProperty("minLength")
}

const isMaxlength = (
  value: ValidationError
): value is { maxLength: { max: string; actual: string } } => {
  return value.hasOwnProperty("maxLength")
}

const isMin = (value: ValidationError): value is { min: { min: string } } => {
  return value.hasOwnProperty("min")
}

const isMax = (value: ValidationError): value is { max: { max: string } } => {
  return value.hasOwnProperty("max")
}

const isTooManyFractionalDigits = (
  value: ValidationError
): value is { tooManyFractionalDigits: { max: string; actual: string } } => {
  return value.hasOwnProperty("tooManyFractionalDigits")
}

const isBuyingLessSharesThanMinAmount = (
  value: ValidationError
): value is { buyingLessSharesThanMinAmount: { min: string } } => {
  return value.hasOwnProperty("buyingLessSharesThanMinAmount")
}

const isBuyingMoreSharesThanMaxTotalAmount = (
  value: ValidationError
): value is {
  buyingMoreSharesThanMaxTotalAmount: { max: string; currently_owned: string }
} => {
  return value.hasOwnProperty("buyingMoreSharesThanMaxTotalAmount")
}

const isUnexpected = (
  value: ValidationError
): value is { unexpected: string } => {
  return value.hasOwnProperty("unexpected")
}
