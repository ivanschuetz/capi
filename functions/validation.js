/// field validation error -> error message
export const toErrorMsg = (e) => {
  // if the field-specific error is null, there's no error so there's no error message
  if (!e) {
    return null;
  }

  switch (e.type_) {
    case "empty":
      return "Please enter something";
    case "min_length":
      return (
        "Must have at least " +
        e.min_length.min +
        " characters. Current: " +
        e.min_length.actual
      );
    case "max_length":
      return (
        "Must have less than " +
        e.max_length.max +
        " characters. Current: " +
        e.max_length.actual
      );
    case "min":
      return "Must be greater than " + e.min.min;
    case "max":
      return "Must be less than " + e.max.max;
    case "address":
      return "Invalid address format";
    case "not_pos":
      return "Please enter a positive amount";
    case "not_int":
      return "Invalid (whole) number format";
    case "not_dec":
      return "Invalid number format";
    case "not_timestamp":
      return "Invalid date";
    case "max_fractionals":
      return (
        "Must have less than " +
        e.max_fractionals.max +
        " fractional digits. Current: " +
        e.max_fractionals.actual
      );
    case "count_le_supply":
      return "Please enter an amount smaller or equal to available shares";
    case "must_be_less_max_invest":
      return "Must be less or equal than max investment";
    case "must_be_more_min_min_invest":
      return "Must be more or equal than min investment";
    case "buying_less_shares_than_min":
      return "The minimum of shares to buy is " + e.min.min;
    case "buying_more_shares_than_max":
      return (
        "You can't own more than " +
        e.max_share_buy.max +
        " shares. Currently owned: " +
        e.max_share_buy.currently_owned
      );
    case "shares_for_investors_greater_than_supply":
      return "Must be less than or equal to supply";
    case "mus_be_after_now":
      return "Date must be in the future";
    case "unexpected":
      return "Unexpected problem: " + e.unexpected;
    default:
      return "";
  }
};
