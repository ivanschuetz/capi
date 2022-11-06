import React, { useState, useEffect, Fragment, useCallback } from "react";
import { StatusMsgUpdater } from "../components/StatusMsgUpdater";
import Modal from "../modal/Modal";
import OpenWalletModal from "../wallet/OpenWalletModal";
import { initWcWalletIfAvailable } from "../wallet/walletConnectWallet";
import { ToastContainer } from "react-toastify";
import { CreateDao } from "../components/CreateDao";
import "react-toastify/dist/ReactToastify.css";
import { useWindowSize } from "../hooks/useWindowSize";
import {
  fetchSharesDistribution,
  fetchHoldersChange,
} from "../controller/shares_distribution";
import {
  fetchAvailableShares,
  initLog,
  loadRaisedFunds,
  updateDao_,
  updateMyBalance_,
  updateMyDividend_,
  updateMyShares,
} from "../controller/app";
import { checkForUpdates } from "../functions/common";
import {
  shortedAddress,
  updateFunds_,
  updateInvestmentData_,
} from "../functions/shared";
import { loadFundsActivity } from "../controller/funds_activity";
import { WireframeWrapper } from "../wireframes/WireframeWrapper";

const Home = () => {
  const [myAddress, setMyAddress] = useState("");

  const [myBalance, setMyBalance] = useState("");

  const [myShares, setMyShares] = useState(null);
  const [myDividend, setMyDividend] = useState(null);
  const [funds, setFunds] = useState(null);
  const [fundsChange, setFundsChange] = useState(null);
  const [daoVersion, setDaoVersion] = useState(null);

  const [myAddressDisplay, setMyAddressDisplay] = useState("");
  const [modal, setModal] = useState(null);

  const [investmentData, setInvestmentData] = useState(null);

  const [dao, setDao] = useState(null);

  const [statusMsgUpdater] = useState(StatusMsgUpdater());
  const [wallet, setWallet] = useState(null);

  const windowSize = useWindowSize();

  const [availableShares, setAvailableShares] = useState(null);
  const [availableSharesNumber, setAvailableSharesNumber] = useState(null);
  const [raisedFundsNumber, setRaisedFundsNumber] = useState(null);
  const [raisedFunds, setRaisedFunds] = useState(null);
  const [raiseState, setRaiseState] = useState(null);

  const [compactFundsActivity, setCompactFundsActivity] = useState(null);

  const [sharesDistr, setSharesDistr] = useState(null);
  const [notOwnedShares, setNotOwnedShares] = useState(null);
  const [holdersChange, setHoldersChange] = useState(null);

  // this is only used when the selected wallet is wallet connect
  const [wcShowOpenWalletModal, setWcShowOpenWalletModal] = useState(false);

  useEffect(() => {
    initWcWalletIfAvailable(
      statusMsgUpdater,
      setMyAddress,
      setWallet,
      setWcShowOpenWalletModal
    );
  }, [statusMsgUpdater]);

  const updateMyBalance = useCallback(
    async (myAddress) => {
      if (myAddress) {
        await updateMyBalance_(statusMsgUpdater, myAddress, setMyBalance);
      }
    },
    [statusMsgUpdater]
  );

  useEffect(() => {
    async function asyncInit() {
      await initLog(statusMsgUpdater);
    }
    asyncInit();
  }, [statusMsgUpdater]);

  useEffect(() => {
    initWcWalletIfAvailable(
      statusMsgUpdater,
      setMyAddress,
      setWallet,
      setWcShowOpenWalletModal
    );
  }, [statusMsgUpdater]);

  useEffect(() => {
    async function nestedAsync() {
      if (myAddress) {
        setMyAddressDisplay(shortedAddress(myAddress));
        await updateMyBalance(myAddress);
      }
    }
    nestedAsync();
  }, [myAddress, updateMyBalance]);

  const updateAvailableShares = useCallback(
    async (daoId) => {
      await fetchAvailableShares(
        statusMsgUpdater,
        daoId,
        setAvailableShares,
        setAvailableSharesNumber
      );
    },
    [statusMsgUpdater]
  );

  const updateDao = useCallback(
    async (daoId) => {
      if (daoId) {
        await updateDao_(daoId, setDao, statusMsgUpdater);
      }
    },
    [statusMsgUpdater]
  );

  const updateShares = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateMyShares(statusMsgUpdater, daoId, myAddress, setMyShares);
      }
    },
    [statusMsgUpdater]
  );

  const updateInvestmentData = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateInvestmentData_(
          statusMsgUpdater,
          myAddress,
          daoId,
          setInvestmentData
        );
      }
    },
    [statusMsgUpdater]
  );

  const updateMyDividend = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateMyDividend_(
          statusMsgUpdater,
          daoId,
          myAddress,
          setMyDividend
        );
      }
    },
    [statusMsgUpdater]
  );

  const updateFunds = useCallback(
    async (daoId) => {
      await updateFunds_(daoId, setFunds, setFundsChange, statusMsgUpdater);
    },
    [statusMsgUpdater]
  );

  const updateDaoVersion = useCallback(
    async (daoId) => {
      await checkForUpdates(statusMsgUpdater, daoId, setDaoVersion);
    },
    [statusMsgUpdater]
  );

  const updateRaisedFunds = useCallback(
    async (daoId) => {
      await loadRaisedFunds(
        statusMsgUpdater,
        daoId,
        setRaisedFunds,
        setRaisedFundsNumber,
        setRaiseState
      );
    },
    [statusMsgUpdater]
  );

  const updateCompactFundsActivity = useCallback(
    async (daoId) => {
      await loadFundsActivity(
        statusMsgUpdater,
        daoId,
        setCompactFundsActivity,
        "3"
      );
    },
    [statusMsgUpdater]
  );

  const updateSharesDistr = useCallback(
    async (dao) => {
      if (dao) {
        await fetchSharesDistribution(
          statusMsgUpdater,
          dao.shares_asset_id,
          dao.share_supply_number,
          dao.app_id,
          setSharesDistr,
          setNotOwnedShares
        );

        await fetchHoldersChange(
          statusMsgUpdater,
          dao.shares_asset_id,
          dao.app_id,
          setHoldersChange
        );
      }
    },
    [statusMsgUpdater]
  );

  const deps = {
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

    myAddressDisplay: myAddressDisplay,
    setMyAddressDisplay: setMyAddressDisplay,

    setModal: setModal,

    statusMsg: statusMsgUpdater,

    myBalance: myBalance,
    updateMyBalance: updateMyBalance,

    myShares: myShares,
    updateMyShares: updateShares,

    myDividend: myDividend,
    updateMyDividend: updateMyDividend,

    investmentData: investmentData,
    updateInvestmentData: updateInvestmentData,

    funds: funds,
    updateFunds: updateFunds,

    fundsChange: fundsChange,

    dao: dao,
    updateDao: updateDao,

    daoVersion: daoVersion,
    updateDaoVersion: updateDaoVersion,

    wallet: wallet,
    setWallet: setWallet,

    setWcShowOpenWalletModal: setWcShowOpenWalletModal,

    availableShares: availableShares,
    availableSharesNumber: availableSharesNumber,
    updateAvailableShares: updateAvailableShares,

    updateRaisedFunds: updateRaisedFunds,
    raisedFundsNumber: raisedFundsNumber,
    raisedFunds: raisedFunds,
    raiseState: raiseState,

    updateCompactFundsActivity: updateCompactFundsActivity,
    compactFundsActivity: compactFundsActivity,

    updateSharesDistr: updateSharesDistr,
    sharesDistr: sharesDistr,
    notOwnedShares: notOwnedShares,
    holdersChange: holdersChange,

    size: windowSizeClasses(windowSize),
  };

  const body = () => {
    return (
      <Fragment>
        {/* <div>{connectButton()}</div> */}

        {/* TODO react -> nextjs, */}
        {/* and remove CreateDao from here */}
        {/* {navigation()} */}
        <WireframeWrapper
          deps={deps}
          isGlobal={true}
          nested={<CreateDao deps={deps} />}
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

export default Home;

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
