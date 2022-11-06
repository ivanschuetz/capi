import Link from "next/link";

const SideBarItem = ({ imageSrc, route, label, showBadge }) => {
  return (
    <Link
      //   TODO nextjs - what was this for actually?
      // end
      href={route}
      className={({ isActive }) => (isActive ? "menu_active" : "menu_inactive")}
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
