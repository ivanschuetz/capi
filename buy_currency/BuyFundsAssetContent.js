export const BuyFundsAssetContent = () => {
  return (
    <div className="mb-32 line-height-1">
      <div className="mb-32">
        {
          "You don't have enough USDC in your wallet to pay for this transaction."
        }
      </div>
      <div>
        {
          "Continue to be directed to a payment provider, where you can buy USDC with a credit card or Apple Pay."
        }
      </div>
    </div>
  );
};
