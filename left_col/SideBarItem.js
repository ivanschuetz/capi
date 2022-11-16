import Link from "next/link";
import { useRouter } from "next/router";

// matchRoute (optional) set if needed to override the path to compare with the router's current path to mark the link as active,
// we need this because the router's path can be dynamic (e.g. [daoId]) and it will return literally the placeholder string,
// which will not match with the actual route
const SideBarItem = ({ imageSrc, route, label, showBadge, matchRoute }) => {
  const router = useRouter();

  const routeToCompare = matchRoute ?? route;

  return (
    <Link
      //   TODO nextjs - what was this for actually?
      // end
      href={route}
      className={
        router.pathname === routeToCompare ? "menu_active" : "menu_inactive"
      }
    >
      <div className="sidebar-item">
        <img src={imageSrc} alt="" />
        {label}
        {showBadge && <div className="settings-dot">{"1"}</div>}
      </div>
    </Link>
  );
};

export default SideBarItem;
