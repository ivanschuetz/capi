import Link from "next/link"
import { BsArrowUpCircle } from "react-icons/bs"
import { FundsAssetImg } from "../images/FundsAssetImg"

export const Funds = ({
  funds,
  showWithdrawLink,
  daoId,
  containerClassNameOpt,
}) => {
  const withdrawButton = () => {
    return (
      showWithdrawLink && (
        <span>
          <Link to={"/" + daoId + "/withdraw"}>
            <BsArrowUpCircle id="withdraw_icon" />
          </Link>
        </span>
      )
    )
  }

  return (
    <div id="dao_funds__cont" className={containerClassNameOpt}>
      <div>{"Available funds"}</div>
      <div id="dao_funds__val">
        <FundsAssetImg />
        <div className="funds">{funds}</div>
        {withdrawButton()}
      </div>
    </div>
  )
}
