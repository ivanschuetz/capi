import React, {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import "react-toastify/dist/ReactToastify.css";
import { StatusMsgUpdater } from "../components/StatusMsgUpdater";
import {
  fetchAvailableShares,
  initLog,
  loadRaisedFunds,
  updateDao_,
  updateMyBalance_,
  updateMyDividend_,
  updateMyShares,
} from "../controller/app";
import { loadFundsActivity } from "../controller/funds_activity";
import {
  fetchHoldersChange,
  fetchSharesDistribution,
} from "../controller/shares_distribution";
import { checkForUpdates } from "../functions/utils";
import { updateFunds_, updateInvestmentData_ } from "../functions/shared";
import { shortedAddress } from "../functions/utils";
import { useWindowSize } from "../hooks/useWindowSize";
import { initWcWalletIfAvailable } from "../wallet/walletConnectWallet";
import { WASMContext } from "./WASM";

const initial: IAppContext = {};

export const AppContext = createContext(initial);

export const AppContextProvider: React.FC<AppContextProviderProps> = ({
  children,
}) => {
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

  const { wasm } = useContext(WASMContext);

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
      if (wasm && myAddress) {
        await updateMyBalance_(wasm, statusMsgUpdater, myAddress, setMyBalance);
      }
    },
    [wasm, statusMsgUpdater]
  );

  useEffect(() => {
    async function asyncInit() {
      if (wasm) {
        await initLog(wasm, statusMsgUpdater);
      }
    }
    asyncInit();
  }, [wasm, statusMsgUpdater]);

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
        wasm,
        statusMsgUpdater,
        daoId,
        setAvailableShares,
        setAvailableSharesNumber
      );
    },
    [wasm, statusMsgUpdater]
  );

  const updateDao = useCallback(
    async (daoId) => {
      if (wasm && daoId) {
        await updateDao_(wasm, daoId, setDao, statusMsgUpdater);
      }
    },
    [wasm, statusMsgUpdater]
  );

  const updateShares = useCallback(
    async (daoId, myAddress) => {
      if (myAddress) {
        await updateMyShares(
          wasm,
          statusMsgUpdater,
          daoId,
          myAddress,
          setMyShares
        );
      }
    },
    [wasm, statusMsgUpdater]
  );

  const updateInvestmentData = useCallback(
    async (daoId, myAddress) => {
      if (wasm && myAddress) {
        await updateInvestmentData_(
          wasm,
          statusMsgUpdater,
          myAddress,
          daoId,
          setInvestmentData
        );
      }
    },
    [wasm, statusMsgUpdater]
  );

  const updateMyDividend = useCallback(
    async (daoId, myAddress) => {
      if (wasm && myAddress) {
        await updateMyDividend_(
          wasm,
          statusMsgUpdater,
          daoId,
          myAddress,
          setMyDividend
        );
      }
    },
    [wasm, statusMsgUpdater]
  );

  const updateFunds = useCallback(
    async (daoId) => {
      if (wasm) {
        await updateFunds_(
          wasm,
          daoId,
          setFunds,
          setFundsChange,
          statusMsgUpdater
        );
      }
    },
    [wasm, statusMsgUpdater]
  );

  const updateDaoVersion = useCallback(
    async (daoId) => {
      if (wasm) {
        await checkForUpdates(wasm, statusMsgUpdater, daoId, setDaoVersion);
      }
    },
    [wasm, statusMsgUpdater]
  );

  const updateRaisedFunds = useCallback(
    async (daoId) => {
      await loadRaisedFunds(
        wasm,
        statusMsgUpdater,
        daoId,
        setRaisedFunds,
        setRaisedFundsNumber,
        setRaiseState
      );
    },
    [wasm, statusMsgUpdater]
  );

  const updateCompactFundsActivity = useCallback(
    async (daoId) => {
      if (wasm) {
        await loadFundsActivity(
          wasm,
          statusMsgUpdater,
          daoId,
          setCompactFundsActivity,
          "3"
        );
      }
    },
    [statusMsgUpdater, wasm]
  );

  const updateSharesDistr = useCallback(
    async (dao) => {
      if (dao) {
        await fetchSharesDistribution(
          wasm,
          statusMsgUpdater,
          dao.shares_asset_id,
          dao.share_supply_number,
          dao.app_id,
          setSharesDistr,
          setNotOwnedShares
        );

        await fetchHoldersChange(
          wasm,
          statusMsgUpdater,
          dao.shares_asset_id,
          dao.app_id,
          setHoldersChange
        );
      }
    },
    [wasm, statusMsgUpdater]
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

    modal: modal,
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

    wcShowOpenWalletModal: wcShowOpenWalletModal,
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

    wasm: wasm,
  };
  return (
    <AppContext.Provider value={{ deps: deps }}>{children}</AppContext.Provider>
  );
};

interface IAppContext {
  // optional just for ts, which needs a default state
  // this is set synchronously so we expect it to be always set
  // TODO better solution?
  deps?: Deps;
}

interface Deps {
  features: Features;

  myAddress: any;
  setMyAddress: any;

  myAddressDisplay: any;
  setMyAddressDisplay: any;

  modal: any;
  setModal: any;

  statusMsg: any;

  myBalance: any;
  updateMyBalance: any;

  myShares: any;
  updateMyShares: any;

  myDividend: any;
  updateMyDividend: any;

  investmentData: any;
  updateInvestmentData: any;

  funds: any;
  updateFunds: any;

  fundsChange: any;

  dao: any;
  updateDao: any;

  daoVersion: any;
  updateDaoVersion: any;

  wallet: any;
  setWallet: any;

  wcShowOpenWalletModal: any;
  setWcShowOpenWalletModal: any;

  availableShares: any;
  availableSharesNumber: any;
  updateAvailableShares: any;

  updateRaisedFunds: any;
  raisedFundsNumber: any;
  raisedFunds: any;
  raiseState: any;

  updateCompactFundsActivity: any;
  compactFundsActivity: any;

  updateSharesDistr: any;
  sharesDistr: any;
  notOwnedShares: any;
  holdersChange: any;

  size: any;

  wasm: any;
}

interface AppContextProviderProps {
  children: ReactNode;
}

interface Features {
  prospectus: boolean;
  minMaxInvestment: boolean;
  // shows info labels in diverse places when the project hasn't finished the fundsraising phase
  stillRaisingFundsLabels: boolean;
  developer: boolean;
  team: boolean;
}

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
