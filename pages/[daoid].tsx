import "react-toastify/dist/ReactToastify.css";
import { Dao } from "../components/Dao";
import { DaoContainer } from "../components/DaoContainer";

const DaoPage = () => {
  return <DaoContainer nested={<Dao />}></DaoContainer>;
};

export default DaoPage;
