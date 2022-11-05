export const toFriendlyError = (msg) => {
  console.log("toFriendlyError: %o", msg);
  return (
    txIdNotFoundError(msg) ??
    tryOverspendError(msg) ??
    tryAssetNotOptedInError(msg) ??
    tryAssetOverspendError(msg) ??
    tealApiConnectionError(msg) ??
    smartContractLogicError(msg) ??
    nodeApiConnectionError(msg)
  );
};

export const tryOverspendError = (msg) => {
  const regex = /account\s(.*?),/;
  const match = msg.match(regex);

  if (match && match.length === 2) {
    let address = match[1];
    return (
      "Address " + address + " doesn't have enough funds to complete the swap."
    );
  } else {
    return null;
  }
};

export const tryAssetNotOptedInError = (msg) => {
  // TransactionPool.Remember: transaction X: asset Y missing from Z
  const regex = /asset\s(.*)\smissing from\s(.*)$/;
  const match = msg.match(regex);

  if (match && match.length === 3) {
    let asset = match[1];
    let address = match[2];
    return "Address " + address + " is not opted in to asset " + asset;
  } else {
    return null;
  }
};

export const tryAssetOverspendError = (msg) => {
  // TransactionPool.Remember: transaction X: underflow on subtracting 1000000 from sender amount 1000
  const regex = /underflow on subtracting (.*) from sender amount (.*)$/;
  const match = msg.match(regex);

  if (match && match.length === 3) {
    let attemptedAmount = match[1];
    let balance = match[2];
    return (
      "Insuffient asset balance (holdings: " +
      balance +
      ", attempted: " +
      attemptedAmount +
      ")."
    );
  } else {
    return null;
  }
};

export const txIdNotFoundError = (msg) => {
  // http error: Some("http://127.0.0.1:8980/v2/transactions/X"), Http error: 404, no transaction found for transaction id: X
  const regex = /, no transaction found for transaction id: (.*)$/;
  const match = msg.match(regex);

  if (match && match.length === 2) {
    let txId = match[1];
    return "Tx id not found: " + txId;
  } else {
    return null;
  }
};

export const tealApiConnectionError = (msg) => {
  if (msg.includes("Failed to fetch") && msg.includes("TealApi")) {
    return "Couldn't connect to smart contracts api. Please try again.";
  } else {
    return null;
  }
};

export const nodeApiConnectionError = (msg) => {
  if (msg.includes("Failed to fetch") && msg.includes("algonaut_client")) {
    return "Couldn't connect to Algorand node. Please try again.";
  } else {
    return null;
  }
};

export const smartContractLogicError = (msg) => {
  // http error 400 included just to make 100% sure that it's the "typical" smart contract error,
  // no particular reason, just to be sure
  if (msg.includes("logic eval error") && msg.includes("Http error: 400")) {
    return "The smart contract rejected the transaction. Please contact support.";
  } else {
    return null;
  }
};
