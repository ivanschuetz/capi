export const BuyAlgosContent = () => {
  return (
    <div className="mb-32">
      <div className="mb-32">
        <span className="line-height-1">
          {"You don't have enough Algos to pay for the transaction fees ("}
        </span>
        <span className="ft-weight-600">{"less than $0.01"}</span>
        <span className="ft-weight-600">{" in total!)"}</span>
      </div>
      <div>
        <span className="line-height-1">
          {
            "Continue to be directed to a payment provider, where you can buy Algos with a credit card or Apple Pay."
          }
        </span>
      </div>
    </div>
  );
};
