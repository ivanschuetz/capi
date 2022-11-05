import React, { useState, useEffect, Fragment } from "react";
import { StatusMsgUpdater } from "./StatusMsgUpdater";
import Modal from "../modal/modal";
import OpenWalletModal from "../wallet/OpenWalletModal";
import { initWcWalletIfAvailable } from "../wallet/walletConnectWallet";
import { ToastContainer } from "react-toastify";
import { CreateDao } from "./CreateDao";
import "react-toastify/dist/ReactToastify.css";
import { useWindowSize } from "../hooks/useWindowSize";

// TODO nextjs: rename and convert to "the app" (less nesting) - this is temporary to quickly copy paste the code from the react app to here
const MyApp = () => {
  const [myAddress, setMyAddress] = useState("");

  const [statusMsgUpdater] = useState(StatusMsgUpdater());
  const [modal, setModal] = useState(null);
  const [wallet, setWallet] = useState(null);
  // this is only used when the selected wallet is wallet connect
  const [wcShowOpenWalletModal, setWcShowOpenWalletModal] = useState(false);

  const windowSize = useWindowSize();

  useEffect(() => {
    initWcWalletIfAvailable(
      statusMsgUpdater,
      setMyAddress,
      setWallet,
      setWcShowOpenWalletModal
    );
  }, [statusMsgUpdater]);

  const body = () => {
    return (
      <Fragment>
        {/* <div>{connectButton()}</div> */}

        {/* TODO react -> nextjs, */}
        {/* and remove CreateDao from here */}
        {/* {navigation()} */}
        <CreateDao
          deps={{
            // conditional features
            features: {
              prospectus: true,
              minMaxInvestment: true,
              // shows info labels in diverse places when the project hasn't finished the fundsraising phase
              stillRaisingFundsLabels: true,
              developer: true,
              team: false,
            },
            myAddress: myAddress,
            setMyAddress: setMyAddress,

            setModal: setModal,

            statusMsg: statusMsgUpdater,

            wallet: wallet,
            setWallet: setWallet,

            setWcShowOpenWalletModal: setWcShowOpenWalletModal,

            size: windowSizeClasses(windowSize),
          }}
        />
      </Fragment>
    );
  };

  return (
    <div>
      <div id="container">
        {body()}
        {modal && (
          <Modal title={modal.title} onClose={() => setModal(null)}>
            {modal.body}
          </Modal>
        )}
        {wcShowOpenWalletModal && (
          <OpenWalletModal setShowModal={setWcShowOpenWalletModal} />
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default MyApp;

const SIZE_TABLET_THRESHOLD = 1330;
const SIZE_PHONE_THRESHOLD = 600;

// returns an object with all size classes, where at least one is expected to be true
// we use abstract identifiers like "s1", to accomodate possible new cases (phone-landscape, tablet with certain aspect ratio etc.) while keeping naming simple
const windowSizeClasses = (windowSize) => {
  const windowWidth = windowSize.width;
  console.log("Window width updated: " + windowWidth);

  // Note: tablet and phone here implies portrait mode. Landscape hasn't been explicitly designed for or tested yet.
  const isTablet =
    windowWidth <= SIZE_TABLET_THRESHOLD && windowWidth > SIZE_PHONE_THRESHOLD;
  const isPhone = windowWidth <= SIZE_PHONE_THRESHOLD;

  return {
    s1: windowWidth > SIZE_TABLET_THRESHOLD, // desktop
    s2: isTablet,
    s3: isPhone,
    s4: isTablet || isPhone, // convenience size, so caller doesn't have to keep writing this
  };
};
