import { Link, useNavigate } from "react-router-dom";
import { useContext } from 'react'; 
import { UserContext } from "./User";

const Navbar = () => {
  const navigate = useNavigate();

  const { user, token, setUser, setToken } = useContext(UserContext);
  const isAuthenticated = !!user && !!token;

  const handleLogout = async () => {
    if (token) {
      try {
        await fetch("http://localhost:8000/logout", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      } catch (err) {
        console.warn("Token may already be invalid:", err);
      }
    }

    localStorage.removeItem("access_token");
    setUser(null);
    setToken(null);
    navigate("/"); // or "/auth"
  };

  const menuItems = [
    { label: "Home", path: "/" },
    { label: "Resume Analysis", path: "/resume-analyser" },
    { label: "Jobs", path: "/jobs" },
    ...(isAuthenticated
      ? [
          { label: "Profile", path: "/profile" },
          { label: "Logout", path: "/auth", onClick: handleLogout },
        ]
      : [{ label: "Login", path: "/auth" }]),
  ];

  return (
    <nav
      className="
        relative top-0 left-0 right-0 
        mx-auto
        w-full
        max-w-full
        bg-[rgba(30,30,30,0.85)]
        backdrop-blur-[8px]
        p-3
        rounded-[16px]
        flex justify-center
        shadow-[0_0_15px_rgba(0,0,0,0.2)]
        select-none
        z-50
        whitespace-nowrap
        overflow-x-auto
        "
      style={{ marginTop: 0 }}
      >
      <ul className="flex gap-[30px] m-0 p-0 flex-nowrap min-w-max list-none">
        {menuItems.map((item) => {
  const isActive = location.pathname === item.path;

  return (
    <li
      key={item.label}
      className={`
        relative
        cursor-pointer
        rounded-full
        px-4 py-2
        font-semibold
        text-gray-300
        transition-colors
        duration-300
        ease-in-out
        ${isActive ? "text-white" : "hover:text-white"}
      `}
    >
      {item.onClick ? (
        <button onClick={item.onClick} className="bg-transparent border-none outline-none">
          {item.label}
        </button>
      ) : (
        <Link to={item.path}>{item.label}</Link>
      )}

      {isActive && !item.onClick && (
        <span
          aria-hidden="true"
          className="
            absolute -top-1.5 -left-1.5 -right-1.5 -bottom-1.5
            rounded-full
            shadow-[0_0_12px_3px_#6fe793]
            pointer-events-none
            transition-shadow duration-300 ease-in-out
          "
        />
      )}
    </li>
  );
})}
      </ul>
    </nav>
  );
};

export default Navbar;
