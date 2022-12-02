import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { Dao } from "../components/Dao"
import { DaoContainer } from "../components/DaoContainer"
import { AppContext } from "../context/AppContext"

const DaoPage = () => {
  const { deps } = useContext(AppContext)

  return <Dao deps={deps} />
}

export default DaoPage

DaoPage.getLayout = function getLayout(page: React.ReactElement) {
  return <DaoContainer nested={page}></DaoContainer>
}
