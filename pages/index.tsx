import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { AppContainer } from "../components/AppContainer"
import { CreateDao } from "../components/CreateDao"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"

const Home = () => {
  const ctx = useContext(AppContext)

  return (
    <AppContainer>
      <WireframeWrapper
        deps={ctx.deps}
        isGlobal={true}
        nested={<CreateDao deps={ctx.deps} />}
      />
    </AppContainer>
  )
}

export default Home
