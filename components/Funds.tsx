import Link from "next/link"
import { BsArrowUpCircle } from "react-icons/bs"
import { FundsAssetImg } from "../images/FundsAssetImg"

export const Funds = ({ funds, showWithdrawLink, daoId }: FundsPars) => {
  return (
    <div className="mt-3 flex">
      <div className="mr-3 text-bg">{"Available funds"}</div>
      <div className="flex items-center gap-1">
        <FundsAssetImg className="h-4" />
        <div className="text-bg">{funds}</div>
        {showWithdrawLink && <WithdrawButton daoId={daoId} />}
      </div>
    </div>
  )
}

const WithdrawButton = ({ daoId }: { daoId: string }) => {
  return (
    <span>
      <Link href={"/" + daoId + "/withdraw"}>
        <BsArrowUpCircle id="withdraw_icon" />
      </Link>
    </span>
  )
}

type FundsPars = {
  funds: string
  showWithdrawLink: boolean
  daoId: string
  containerClassNameOpt?: string
}
