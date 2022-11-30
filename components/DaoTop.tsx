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
      <div>{LogoView(dao)}</div>
      <Social dao={dao} setShowModal={setShowShareModal} />
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

const Social = ({ dao, setShowModal }) => {
  return (
    <div className="title-container">
      <div className="title">{dao.name}</div>
      <div className="social-media-buttons">
        {dao.social_media_url && (
          <a href={dao.social_media_url} target="_blank" rel="noreferrer">
            <div className="button__follow share-icon">
              <img src={twitter.src} alt="logo-twitter" />
            </div>
          </a>
        )}
        <div
          className="button-share share-icon"
          onClick={() => setShowModal((visible) => !visible)}
        >
          <img src={share.src} alt="share-icon" />
        </div>
      </div>
    </div>
  )
}

const LogoView = (dao) => {
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

const projectUrl = (daoId) => {
  return window.location.protocol + "//" + window.location.host + "/" + daoId
}
