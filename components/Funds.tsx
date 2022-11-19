import Link from "next/link"
import { BsArrowUpCircle } from "react-icons/bs"
import { FundsAssetImg } from "../images/FundsAssetImg"

export const Funds = ({
  funds,
  showWithdrawLink,
  daoId,
  containerClassNameOpt,
}) => {
  return (
    <div id="dao_funds__cont" className={containerClassNameOpt}>
      <div>{"Available funds"}</div>
      <div id="dao_funds__val">
        <FundsAssetImg />
        <div className="funds">{funds}</div>
        {showWithdrawLink && <WithdrawButton daoId={daoId} />}
      </div>
    </div>
  )
}

const WithdrawButton = ({ daoId }) => {
  return (
    <span>
      <Link href={"/" + daoId + "/withdraw"}>
        <BsArrowUpCircle id="withdraw_icon" />
      </Link>
    </span>
  )
}
