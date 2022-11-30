import { useContext } from "react"
import "react-toastify/dist/ReactToastify.css"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"
import { AppContainer } from "./AppContainer"

export const DaoContainer = ({ nested }: { nested: JSX.Element }) => {
  const ctx = useContext(AppContext)

  return (
    <AppContainer>
      <WireframeWrapper deps={ctx.deps} isGlobal={false} nested={nested} />
    </AppContainer>
  )
}
