export const init = async (wasm, statusMsg, daoId, daoMaybe, setDao) => {
  try {
    // if we're loading via URL (instead of another page that passes the dao as parameter), fetch the dao
    var dao = null;
    if (daoMaybe) {
      dao = daoMaybe;
    } else {
      dao = await wasm.bridge_load_dao(daoId);
    }

    setDao(dao);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const withdraw = async (
  wasm,

  statusMsg,
  myAddress,
  wallet,
  updateMyBalance,
  updateFunds,

  showProgress,
  daoId,
  withdrawalAmount,
  withdrawalDescr
) => {
  try {
    statusMsg.clear();

    showProgress(true);
    let withdrawRes = await wasm.bridge_withdraw({
      dao_id: daoId,
      sender: myAddress,
      withdrawal_amount: withdrawalAmount,
      description: withdrawalDescr,
    });
    // TODO update list with returned withdrawals list
    console.log("withdrawRes: " + JSON.stringify(withdrawRes));
    showProgress(false);

    let withdrawResSigned = await wallet.signTxs(withdrawRes.to_sign);
    console.log("withdrawResSigned: " + withdrawResSigned);

    showProgress(true);
    let submitWithdrawRes = await wasm.bridge_submit_withdraw({
      txs: withdrawResSigned,
      pt: withdrawRes.pt,
    });

    console.log("submitWithdrawRes: " + JSON.stringify(submitWithdrawRes));

    statusMsg.success("Withdrawal request submitted");
    showProgress(false);

    await updateMyBalance(myAddress);
    await updateFunds(daoId);
  } catch (e) {
    statusMsg.error(e);
    showProgress(false);
  }
};
