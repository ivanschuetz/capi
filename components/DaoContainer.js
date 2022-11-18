import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { AppContainer } from "../components/AppContainer"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"

export const DaoContainer = ({ nested }) => {
  const ctx = useContext(AppContext)

  return (
    <AppContainer>
      <WireframeWrapper deps={ctx.deps} isGlobal={false} nested={nested} />
    </AppContainer>
  )
}
