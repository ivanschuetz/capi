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

  const handleCloseClick = (e) => {
    e.preventDefault();
    onClose();
  };

  // close with click on bg
  const onModalClick = (event) => {
    if (event.target === document.querySelector(`#${modalContainerId}`)) {
      onClose();
    }
  };

  const view = (
    <div id={modalContainerId} className={styles.modal} onClick={onModalClick}>
      <div className={`${styles.modal_content} ${styles.modal_content_size}`}>
        <div
          className={styles.modal_topbar_x}
          onClick={(e) => handleCloseClick(e)}
        >
          <img src={close.src} alt="close" />
        </div>
        <div className={styles.modal_topbar}>
          <p className={styles.modal_topbar_title}>{title}</p>
        </div>
        <div className={styles.modal_body}>{children}</div>
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
