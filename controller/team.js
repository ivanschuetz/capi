import { toBytes } from "../functions/utils";
import { toMaybeIpfsUrl } from "../ipfs/store";
import { toErrorMsg } from "../functions/validation";

export const getTeam = async (wasm, statusMsg, url, setTeam) => {
  try {
    const team = await wasm.bridge_get_team({
      url: url,
    });

    console.log({ team });
    setTeam(team.team);
  } catch (e) {
    statusMsg.error(e);
  }
};

export const addTeamMember = async (
  wasm,

  statusMsg,
  wallet,

  showProgress,

  daoId,
  myAddress,

  name,
  role,
  descr,
  picture,
  social_link,
  team,
  setTeam,

  setNameError,
  setRoleError,
  setDescrError,
  setPictureError,
  setSocialError
) => {
  try {
    statusMsg.clear();

    showProgress(true);
    // update json + possible validations in wasm
    let addMemberRes = await wasm.bridge_add_team_member({
      inputs: {
        name,
        role,
        descr,
        picture,
        social_links: [social_link],
      },
      existing_members: team,
    });
    console.log("addMemberRes: " + JSON.stringify(addMemberRes));

    // save json to ipfs (ideally we'd do this in wasm too, but web3 sdk is js)
    const teamUrl = await toMaybeIpfsUrl(toBytes(await addMemberRes.to_save));

    // save the ipfs url in dao state
    let setTeamRes = await wasm.bridge_set_team({
      dao_id: daoId,
      owner_address: myAddress,
      url: teamUrl,
    });
    console.log("setTeamRes: " + JSON.stringify(setTeamRes));
    showProgress(false);

    let setTeamResSigned = await wallet.signTxs(setTeamRes.to_sign);
    console.log("withdrawResSigned: " + setTeamResSigned);

    showProgress(true);
    let submitTeamRes = await wasm.bridge_submit_set_team({
      txs: setTeamResSigned,
    });

    console.log("submitTeamRes: " + JSON.stringify(submitTeamRes));

    statusMsg.success("Update team submitted");

    // we wait for the complete process to succeed before showing the updated team
    setTeam(addMemberRes.team);

    showProgress(false);
  } catch (e) {
    if (e.type_identifier === "input_errors") {
      setNameError(toErrorMsg(e.name));
      setDescrError(toErrorMsg(e.description));
      setRoleError(toErrorMsg(e.share_supply));
      setPictureError(toErrorMsg(e.share_price));
      setSocialError(toErrorMsg(e.investors_share));

      // show a general message additionally, just in case
      statusMsg.error("Please fix the errors");
    } else {
      statusMsg.error(e);
    }

    showProgress(false);
  }
};
