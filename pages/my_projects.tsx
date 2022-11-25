import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { AppContainer } from "../components/AppContainer"
import { MyDaos } from "../components/MyDaos"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"

const MyProjectsPage = () => {
  const ctx = useContext(AppContext)

  return (
    <AppContainer>
      <WireframeWrapper
        deps={ctx.deps}
        isGlobal={true}
        nested={<MyDaos deps={ctx.deps} />}
      />
    </AppContainer>
  )
}

export default MyProjectsPage
