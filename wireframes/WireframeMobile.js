import React, { useMemo, useState } from "react";
import Link from "next/link";
import { DaoTop } from "../components/DaoTop";
import { SideBar } from "../left_col/SideBar";
import { SideBarDao } from "../left_col/SideBarDao";
import menu from "../images/svg/menu.svg";
import logo from "../images/logo.svg";
import { MobileWalletView } from "../right_col/MobileWalletView";
import wallet from "../images/svg/account.svg";

// TODO nextjs
// export const WireframeMobile = ({ isGlobal, deps }) => {
export const WireframeMobile = ({ isGlobal, deps, nested }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const [showWallet, setShowWallet] = useState(false);

  const sideMenuClass = useMemo(() => {
    if (showSidebar) {
      return "sidebar-container";
    } else {
      return "sidebar-container sidebar-container-closing";
    }
  }, [showSidebar]);

  const rightColClass = useMemo(() => {
    if (showWallet) {
      return "rightcol";
    } else {
      return "rightcol-closing";
    }
  }, [showWallet]);

  const sideBar = () => {
    if (isGlobal) {
      return <SideBar deps={deps} containerClass={sideMenuClass} />;
    } else {
      return <SideBarDao deps={deps} containerClass={sideMenuClass} />;
    }
  };

  const daoTop = () => {
    return !isGlobal && deps.dao && <DaoTop dao={deps.dao} />;
  };

  const showOverlay = showSidebar || showWallet;

  return (
    <>
      <MobNavBar
        setShowSidebar={setShowSidebar}
        setShowWallet={setShowWallet}
      />
      {/* now it's always shown */}
      {/* {showSidebar && sideBar()} */}
      {sideBar()}
      {showOverlay && (
        <ContentOverlay
          setShowSidebar={setShowSidebar}
          setShowWallet={setShowWallet}
        />
      )}
      <MobileWalletView
        deps={deps}
        containerClass={rightColClass}
        onClose={() => setShowWallet(false)}
      />
      <div id="content">
        {daoTop()}
        {nested}
        {/* TODO nextjs */}
        {/* <Outlet /> */}
      </div>
    </>
  );
};

const ContentOverlay = ({ setShowSidebar, setShowWallet }) => {
  return (
    <div
      id="mob_nav_bar_overlay"
      onClick={() => {
        setShowSidebar(false);
        setShowWallet(false);
      }}
    />
  );
};

const MobNavBar = ({ setShowSidebar, setShowWallet }) => {
  return (
    <div className="mob_nav_bar">
      <img
        src={menu.src}
        alt="nav_bars"
        onClick={() => setShowSidebar((s) => !s)}
      />
      <Link href="#">
        <img src={logo.src} alt="logo" />
      </Link>
      <img
        src={wallet.src}
        alt="wallet"
        onClick={() => setShowWallet((s) => !s)}
      />
    </div>
  );
};
