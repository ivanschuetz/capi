import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import home from "../images/sidebar/home.svg";
import stats from "../images/sidebar/stats.svg";
import funds from "../images/sidebar/funds.svg";
import arrows from "../images/sidebar/funds-activity.svg";
import settings from "../images/sidebar/settings.svg";
import create from "../images/sidebar/create.svg";
import project from "../images/sidebar/projects.svg";
import SideBarItem from "./SideBarItem";
import logo from "../images/logo.svg";
import { DevSettingsModal } from "../dev_settings/DevSettingsModal";
import { AppVersion } from "./AppVersion";

export const SideBarDao = ({ deps, containerClass }) => {
  const [devSettingsModal, setDevSettingsModal] = useState(false);

  const router = useRouter();
  const { daoId } = router.query;

  useEffect(() => {
    async function asyncFn() {
      deps.updateMyShares.call(null, daoId, deps.myAddress);
    }
    if (deps.myAddress) {
      asyncFn();
    }
  }, [daoId, deps.myAddress, deps.updateMyShares]);

  useEffect(() => {
    async function asyncInit() {
      await deps.updateDao.call(null, daoId);
    }
    asyncInit();
  }, [daoId, deps.statusMsg, deps.updateDao]);

  const iHaveShares = deps.myShares && deps.myShares.total > 0;
  const iAmDaoOwner = iAmDaoOwner_(deps.dao, deps.myAddress);

  return (
    <div className={containerClass}>
      <div className="logo-container">
        <img src={logo} alt="logo" />
      </div>
      <SideBarItem imageSrc={create} route="/" label="Create" />
      <SideBarItem
        imageSrc={project}
        route="/my_projects"
        label="My Projects"
      />
      {deps.features.developer && (
        <div className="clickable" onClick={() => setDevSettingsModal(true)}>
          {"Dev settings"}
        </div>
      )}
      {deps.features.developer && <AppVersion deps={deps} />}

      <div className="dividing-line"></div>
      <SideBarItem imageSrc={home} route="" label="Project Home" />
      {deps.features.team && (
        <SideBarItem imageSrc={project} route="team" label="Team" />
      )}
      <SideBarItem imageSrc={stats} route="stats" label="Statistics" />
      {iHaveShares && (
        <SideBarItem
          imageSrc={funds}
          route="investment"
          label="My Investment"
        />
      )}
      {iAmDaoOwner && deps.dao && deps.dao.funds_raised === "true" && (
        <SideBarItem imageSrc={funds} route="withdraw" label="Withdraw" />
      )}
      <SideBarItem
        imageSrc={arrows}
        route="funds_activity"
        label="Funds activity"
      />
      {iAmDaoOwner && (
        <SideBarItem
          imageSrc={settings}
          route="settings"
          label="Project settings"
          showBadge={deps.daoVersion?.update_data}
        />
      )}
      {devSettingsModal && (
        <DevSettingsModal closeModal={() => setDevSettingsModal(false)} />
      )}
    </div>
  );
};

const iAmDaoOwner_ = (dao, myAddress) => {
  //   return dao && myAddress && dao.creator_address === myAddress;
  return true; // see owner items / views in mock
};
