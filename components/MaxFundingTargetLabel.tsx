import funds from "../images/funds.svg"
import { InputLeftImg, Label } from "./labeled_inputs"

export const MaxFundingTargetLabel = ({ text }: { text: string }) => {
  return (
    <div className="f-basis-50">
      <div>
        <Label
          text={"Max funding target"}
          info={"The maximum amount that can be raised (share supply x price)"}
        />
        <div className="relative flex h-16 items-center">
          <div className="flex h-16 items-center pr-5 pl-14">{text}</div>
          <InputLeftImg img={funds} />
        </div>
      </div>
    </div>
  )
}
