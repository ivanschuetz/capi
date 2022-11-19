import Link from "next/link"
import plus from "../images/svg/plus.svg"

export const MyDaoCreateItem = () => {
  return (
    <div key="create_item_key___" className="my_dao">
      <div className="text-center">
        <Link href={"/"} className="text-center">
          {"Create project"}
        </Link>
      </div>
      <div className="my_dao_create_project">
        <Link href={"/"} className="text-center">
          <img src={plus.src} alt="icon" />
        </Link>
      </div>
    </div>
  )
}
