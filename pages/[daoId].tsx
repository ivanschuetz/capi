import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Dao } from "../components/Dao"
import { DaoContainer } from "../components/DaoContainer"
import { AppContext } from "../context/App"

const DaoPage = () => {
  const { deps } = useContext(AppContext)

  return <DaoContainer nested={<Dao deps={deps} />}></DaoContainer>
}

export default DaoPage
