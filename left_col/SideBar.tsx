import SideBarItem from "./SideBarItem"
import create from "../images/sidebar/create.svg"
import project from "../images/sidebar/projects.svg"
import logo from "../images/logo.svg"
import { useState } from "react"
import { DevSettingsModal } from "../dev_settings/DevSettingsModal"
import { AppVersion } from "./AppVersion"
import { Deps } from "../context/AppContext"

export const SideBar = ({
  deps,
  containerClass,
}: {
  deps: Deps
  containerClass: string
}) => {
  const [devSettingsModal, setDevSettingsModal] = useState(false)

  return (
    <div className={containerClass}>
      <div className="logo-container">
        <img src={logo.src} alt="logo" />
      </div>
      <SideBarItem imageSrc={create.src} route="/" label="Create" />
      <SideBarItem
        imageSrc={project.src}
        route="/my_projects"
        label="My projects"
      />
      {deps.features.developer && (
        <div className="clickable" onClick={() => setDevSettingsModal(true)}>
          {"Dev settings"}
        </div>
      )}
      {deps.features.developer && <AppVersion deps={deps} />}
      {devSettingsModal && (
        <DevSettingsModal closeModal={() => setDevSettingsModal(false)} />
      )}
    </div>
  )
}
