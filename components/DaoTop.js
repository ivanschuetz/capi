import twitter from "../images/svg/twitter.svg";
import share from "../images/svg/share.svg";
import Modal from "../modal/Modal";
import ShareView from "./ShareView";
import React, { useState } from "react";
import Progress from "./Progress";

export const DaoTop = ({ dao }) => {
  const [showShareModal, setShowShareModal] = useState(false);
  return (
    <div>
      <div>{LogoView(dao)}</div>
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
            onClick={() => setShowShareModal((visible) => !visible)}
          >
            <img src={share.src} alt="share-icon" />
          </div>
        </div>
      </div>
      {showShareModal && dao && (
        <Modal
          title={"Share at social media"}
          onCloseClick={() => setShowShareModal(false)}
        >
          <ShareView projectUrl={projectUrl(dao.app_id)} />
        </Modal>
      )}
    </div>
  );
};

const LogoView = (dao) => {
  const [imgLoaded, setImageLoaded] = useState(false);
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
  );
};

const projectUrl = (daoId) => {
  return window.location.protocol + "//" + window.location.host + "/" + daoId;
};
