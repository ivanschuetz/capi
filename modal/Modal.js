import * as ReactDOM from "react-dom";
import React from "react";
import close from "../images/svg/close.svg";

const Modal = ({ title, children, onCloseClick }) => {
  const onModalClick = (event) => {
    if (event.target === document.querySelector(".modal")) {
      onCloseClick();
    }
  };

  return ReactDOM.createPortal(
    <div className="modal" onClick={onModalClick}>
      <div className="modal-content modal-content-size">
        <div className="modal-topbar-x" onClick={() => onCloseClick()}>
          <img src={close} alt="close" />
        </div>
        <div className="modal-topbar">
          <p className="modal-topbar-title">{title}</p>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>,
    document.getElementById("modal-root")
  );
};

export default Modal;
