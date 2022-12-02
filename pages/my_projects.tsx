import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { AppContainer } from "../components/AppContainer"
import { MyDaos } from "../components/MyDaos"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"

const MyProjectsPage = () => {
  const { deps } = useContext(AppContext)

  return <MyDaos deps={deps} />
}

export default MyProjectsPage

MyProjectsPage.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppContainer>
      <WireframeWrapper isGlobal={true} nested={page} />
    </AppContainer>
  )
}
