import { Fragment, useContext } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { CreateDao } from "../components/CreateDao";
import Modal from "../modal/Modal";
import OpenWalletModal from "../wallet/OpenWalletModal";
import { WireframeWrapper } from "../wireframes/WireframeWrapper";

import { AppContext } from "../context/App";

const Home = () => {
  const ctx = useContext(AppContext);

  const body = () => {
    return (
      <Fragment>
        {/* <div>{connectButton()}</div> */}

        {/* TODO react -> nextjs, */}
        {/* and remove CreateDao from here */}
        {/* {navigation()} */}
        <WireframeWrapper
          deps={ctx.deps}
          isGlobal={true}
          nested={<CreateDao deps={ctx.deps} />}
        />
      </Fragment>
    );
  };

  return (
    <div>
      <div id="container">
        {body()}
        {ctx.deps.modal && (
          <Modal
            title={ctx.deps.modal.title}
            onClose={() => ctx.deps.setModal(null)}
          >
            {ctx.deps.modal.body}
          </Modal>
        )}
        {ctx.deps.wcShowOpenWalletModal && (
          <OpenWalletModal setShowModal={ctx.deps.setWcShowOpenWalletModal} />
        )}
        <ToastContainer />
      </div>
    </div>
  );
};

export default Home;
