import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { CreateDao } from "../components/CreateDao"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"
import { AppContext } from "../context/App"
import { AppContainer } from "../components/AppContainer"

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
