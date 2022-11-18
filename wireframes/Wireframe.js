import { RightCol } from "../right_col/RightCol"
import { RightDaoCol } from "../right_col/RightDaoCol"
import { DaoTop } from "../components/DaoTop"
import { SideBar } from "../left_col/SideBar"
import { SideBarDao } from "../left_col/SideBarDao"

// TODO nextjs
// export const Wireframe = ({ isGlobal, deps }) => {
export const Wireframe = ({ isGlobal, deps, nested }) => {
  const sideBar = () => {
    if (isGlobal) {
      return <SideBar deps={deps} containerClass={"sidebar-container"} />
    } else {
      return <SideBarDao deps={deps} containerClass={"sidebar-container"} />
    }
  }

  const rightCol = () => {
    if (isGlobal) {
      return <RightCol deps={deps} />
    } else {
      return <RightDaoCol deps={deps} />
    }
  }

  const daoTop = () => {
    return !isGlobal && deps.dao && <DaoTop dao={deps.dao} />
  }

  return (
    <div id="nav_and_main">
      {sideBar()}
      <div id="content">
        {daoTop()}
        {nested}
      </div>
      {rightCol()}
    </div>
  )
}
