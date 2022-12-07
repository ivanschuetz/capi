import { useState } from "react"
import { DaoJs } from "wasm/wasm"
import share from "../images/svg/share.svg"
import twitter from "../images/svg/twitter.svg"
import Modal from "../modal/Modal"
import { SetBool } from "../type_alias"
import Progress from "./Progress"
import ShareView from "./ShareView"

export const DaoTop = ({ dao }: { dao: DaoJs; setShowShareModal: SetBool }) => {
  const [showShareModal, setShowShareModal] = useState(false)

  return (
    <div>
      <CoverImg dao={dao} />
      <TopBar dao={dao} setShowModal={setShowShareModal} />
      {showShareModal && dao && (
        <ShareModal dao={dao} setShowModal={setShowShareModal} />
      )}
    </div>
  )
}

const ShareModal = ({
  dao,
  setShowModal,
}: {
  dao: DaoJs
  setShowModal: SetBool
}) => {
  return (
    <Modal title={"Share at social media"} onClose={() => setShowModal(false)}>
      <ShareView projectUrl={projectUrl(dao.app_id)} />
    </Modal>
  )
}

const TopBar = ({
  dao,
  setShowModal,
}: {
  dao: DaoJs
  setShowModal: SetBool
}) => {
  return (
    <div className="title-container">
      <div className="title">{dao.name}</div>
      <SocialButtons dao={dao} setShowModal={setShowModal} />
    </div>
  )
}

const SocialButtons = ({
  dao,
  setShowModal,
}: {
  dao: DaoJs
  setShowModal: SetBool
}) => {
  return (
    <div className="social-media-buttons">
      {dao.social_media_url && (
        <SocialButton url={dao.social_media_url} icon={twitter.src} />
      )}
      <ShareButton setShowModal={setShowModal} />
    </div>
  )
}

const SocialButton = ({ url, icon }: { url: string; icon: any }) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <div className="button__follow share-icon">
        <img src={icon} alt="logo-twitter" />
      </div>
    </a>
  )
}

const ShareButton = ({ setShowModal }: { setShowModal: SetBool }) => {
  return (
    <div className="button-share share-icon" onClick={() => setShowModal(true)}>
      <img src={share.src} alt="share-icon" />
    </div>
  )
}

const CoverImg = ({ dao }: { dao: DaoJs }) => {
  const [imgLoaded, setImageLoaded] = useState(false)

  return (
    dao.image_url && (
      <div className="content-img-container">
        {!imgLoaded && <Progress />}
        <img
          className={`content-img ${!imgLoaded ? "d-none" : ""}`}
          src={dao.image_url}
          alt="Cover"
          onLoad={() => setImageLoaded(true)}
        />
      </div>
    )
  )
}

const projectUrl = (daoId: string) => {
  return window.location.protocol + "//" + window.location.host + "/" + daoId
}
