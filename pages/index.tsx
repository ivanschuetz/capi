import { useContext } from "react"

import { AppContainer } from "../components/AppContainer"
import { CreateDao } from "../components/CreateDao"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"

const Home = () => {
  const { deps } = useContext(AppContext)

  return <CreateDao deps={deps} />
}

export default Home

Home.getLayout = function getLayout(page: React.ReactElement) {
  return (
    <AppContainer>
      <WireframeWrapper isGlobal={true} nested={page} />
    </AppContainer>
  )
}
