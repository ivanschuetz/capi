import { useState } from "react";
import {
  saveDevSettingCapiAddress,
  saveDevSettingFundsAssetId,
} from "../modal/storage";
import { LabeledInput } from "../components/labeled_inputs";
import { SubmitButton } from "../components/SubmitButton";

export const DevSettings = ({ closeModal }) => {
  const [fundsAssetId, setFundsAssetId] = useState("");
  const [capiAddress, setCapiAddress] = useState("");
  return (
    <div>
      <div>{"Enter data displayed when network_test_util completes."}</div>
      <div>
        {
          "This has to be done every time network_test_util generates new/different values OR after clearing the browser's cache"
        }
      </div>
      <div className="mb-20">
        {"If you make a mistake, just submit it again, and refresh."}
      </div>
      <LabeledInput
        label={"Funds asset id"}
        inputValue={fundsAssetId}
        onChange={(input) => setFundsAssetId(input)}
      />
      <LabeledInput
        label={"Capi address"}
        inputValue={capiAddress}
        onChange={(input) => setCapiAddress(input)}
      />
      <SubmitButton
        label={"Submit"}
        className={"button-primary"}
        disabled={fundsAssetId === "" || capiAddress === ""}
        onClick={async () => {
          saveDevSettingCapiAddress(capiAddress);
          saveDevSettingFundsAssetId(fundsAssetId);
          closeModal();
        }}
      />
    </div>
  );
};
