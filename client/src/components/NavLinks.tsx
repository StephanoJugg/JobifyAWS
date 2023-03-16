import { NavLink } from "react-router-dom";
import links from "../utils/Links";

interface NavLinksProps {
  toggleSidebar?: () => void;
}

export default function NavLinks({ toggleSidebar }: NavLinksProps) {
  return (
    <div className="nav-links">
      {links.map((link) => {
        const { id, text, path, icon } = link;
        return (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
            onClick={toggleSidebar}
          >
            <span className="icon">{icon}</span>
            {text}
          </NavLink>
        );
      })}
    </div>
  );
}
