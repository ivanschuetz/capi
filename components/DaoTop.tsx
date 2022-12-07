import { useState } from "react"
import { DaoJs } from "wasm/wasm"
import Modal from "../modal/Modal"
import { SetBool } from "../type_alias"
import SvgShare from "./icons/SvgShare"
import SvgTwitter from "./icons/SvgTwitter"
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
    <div className="mb-6 flex w-full flex-col justify-between gap-6 md:mb-10 md:items-start md:gap-10 xl:flex-row">
      <div className="text-80 font-bold text-te">{dao.name}</div>
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
    <div className="flex items-center gap-4">
      {dao.social_media_url && (
        <SocialButton url={dao.social_media_url}>
          <SvgTwitter className="fill-bg" />
        </SocialButton>
      )}
      <ShareButton setShowModal={setShowModal} />
    </div>
  )
}

const SocialButton = ({
  url,
  children,
}: {
  url: string
  children: JSX.Element
}) => {
  return (
    <a href={url} target="_blank" rel="noreferrer">
      <RoundButton bgColor="bg-twitter">{children}</RoundButton>
    </a>
  )
}

const ShareButton = ({ setShowModal }: { setShowModal: SetBool }) => {
  return (
    <RoundButton bgColor="bg-te" onClick={() => setShowModal(true)}>
      <SvgShare className="fill-bg" />
    </RoundButton>
  )
}

const RoundButton = ({
  bgColor,
  onClick,
  children,
}: {
  bgColor: string
  onClick?: () => void
  children: JSX.Element
}) => {
  return (
    <div
      className={`center-children h-12 w-12 cursor-pointer rounded-full ${bgColor}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}

const CoverImg = ({ dao }: { dao: DaoJs }) => {
  const [imgLoaded, setImageLoaded] = useState(false)

  const imgVisible = !imgLoaded ? "hidden" : ""

  return (
    dao.image_url && (
      <div className="relative mb-10 h-[360px] w-full overflow-hidden">
        {!imgLoaded && <Progress />}
        <img
          className={`mb-6 h-[266px] w-full object-cover sm:h-[240px] xl:h-auto ${imgVisible}`}
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
