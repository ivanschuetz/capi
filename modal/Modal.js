import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import close from "../images/svg/close.svg";
import styles from "./modal.module.sass";

const modalContainerId = "modal_container";

export const Modal = ({ title, children, onClose }) => {
  const [isBrowser, setIsBrowser] = useState(false);

  useEffect(() => {
    setIsBrowser(true);
  }, []);

  // close with click on bg
  const onModalClick = (event) => {
    if (event.target === document.querySelector(`#${modalContainerId}`)) {
      onClose();
    }
  };

  const view = (
    <div className="modal" onClick={onModalClick}>
      <div className="modal-content modal-content-size">
        <div className="modal-topbar-x" onClick={() => onClose()}>
          <img src={close.src} alt="close" />
        </div>
        <div className="modal-topbar">
          <p className="modal-topbar-title">{title}</p>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );

  if (isBrowser) {
    return ReactDOM.createPortal(view, document.getElementById("modal_root"));
  } else {
    return null;
  }
};

export default Modal;
