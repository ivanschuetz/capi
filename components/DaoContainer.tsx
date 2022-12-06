import { useContext, useEffect } from "react"
import "react-toastify/dist/ReactToastify.css"
import { AppContext } from "../context/AppContext"
import { WireframeWrapper } from "../wireframes/WireframeWrapper"
import { AppContainer } from "./AppContainer"

export const DaoContainer = ({ nested }: { nested: JSX.Element }) => {
  return (
    <AppContainer>
      <WireframeWrapper isGlobal={false} nested={nested} />
    </AppContainer>
  )
}
