import funds from "../images/funds.svg";
import ReactTooltip from "react-tooltip";
import info from "../images/svg/info.svg";

export const MaxFundingTargetLabel = ({ text }) => {
  return (
    <div className="f-basis-50">
      <div className="pl-25 grey-160">
        <div className="d-flex align-center mb-8">
          <div className="ft-weight-600">{"Max funding target"}</div>
          <div
            className="d-flex align-center ml-10"
            data-tip={
              "The maximum amount that can be raised (share supply x price)"
            }
          >
            <img src={info} alt="info" />
          </div>
          <ReactTooltip />
        </div>
        <div className="d-flex align-center h-64px">
          <img src={funds} alt="img" />
          <div className="ml-10">{text}</div>
        </div>
      </div>
    </div>
  );
};
