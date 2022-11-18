import React, { useContext } from "react";
import { Team } from "../../components/Team";
import { AppContext } from "../../context/App";
import { DaoContainer } from "../../components/DaoContainer";

const TeamPage = () => {
  const { deps } = useContext(AppContext);

  return <DaoContainer nested={<Team deps={deps} />} />;
};

export default TeamPage;
