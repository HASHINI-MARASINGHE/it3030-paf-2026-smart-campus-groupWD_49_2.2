import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";

function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout, hasRole } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate("/");
  };

  return (
    <header style={styles.header}>
      <div>
        <h1 style={styles.logo}>SLIIT Smart Campus</h1>
        <p style={styles.subtitle}>Operations Hub</p>
      </div>

      <nav style={styles.nav}>
        <Link
          to="/"
          style={{
            ...styles.navLink,
            ...(isActive("/") ? styles.activeNavLink : {}),
          }}
        >
          Home
        </Link>

        {isAuthenticated && (
          <>
            <Link
              to="/facilities"
              style={{
                ...styles.navLink,
                ...(isActive("/facilities") ? styles.activeNavLink : {}),
              }}
            >
              Facilities
            </Link>

            {hasRole("ADMIN") && (
              <Link
                to="/admin"
                style={{
                  ...styles.navLink,
                  ...(isActive("/admin") ? styles.activeNavLink : {}),
                }}
              >
                Admin
              </Link>
            )}
          </>
        )}

        {!isAuthenticated && (
          <>
            <Link to="/login" style={styles.loginBtn}>
              Login
            </Link>
            <Link to="/register" style={styles.registerBtn}>
              Register
            </Link>
          </>
        )}

        {isAuthenticated && (
          <div style={styles.userDropdown}>
            <button
              style={styles.userBtn}
              onClick={() => setShowDropdown(!showDropdown)}
            >
              {user?.profilePictureUrl ? (
                <img
                  src={user.profilePictureUrl}
                  alt="Profile"
                  style={styles.profileImage}
                />
              ) : (
                <span>👤</span>
              )}
              <span>{user?.fullName || user?.username}</span>
              <span style={styles.dropdown}>▼</span>
            </button>

            {showDropdown && (
              <div style={styles.dropdownMenu}>
                <div style={styles.userInfo}>
                  <strong>{user?.fullName}</strong>
                  <p style={styles.userEmail}>{user?.email}</p>
                  {user?.roles && (
                    <p style={styles.userRole}>
                      Role: {user.roles.join(", ")}
                    </p>
                  )}
                </div>
                <div style={styles.dropdownDivider}></div>
                <button
                  style={styles.dropdownItem}
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>
    </header>
  );
}

const styles = {
  header: {
    backgroundColor: "#ffffff",
    borderBottom: "4px solid #f4b400",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "20px 50px",
    flexWrap: "wrap",
    gap: "12px",
  },
  logo: {
    color: "#1f2f6b",
    fontSize: "34px",
    fontWeight: "bold",
    margin: 0,
  },
  subtitle: {
    color: "#37424a",
    marginTop: "4px",
    marginBottom: 0,
  },
  nav: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
    position: "relative",
  },
  navLink: {
    fontWeight: "bold",
    color: "#37424a",
    textDecoration: "none",
    padding: "10px 12px",
    borderRadius: "8px",
  },
  activeNavLink: {
    backgroundColor: "#eef2ff",
    color: "#1f2f6b",
  },
  loginBtn: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  registerBtn: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "10px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
  },
  userDropdown: {
    position: "relative",
  },
  userBtn: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    padding: "8px 12px",
    backgroundColor: "#eef2ff",
    border: "2px solid #1f2f6b",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
    color: "#1f2f6b",
  },
  profileImage: {
    width: "32px",
    height: "32px",
    borderRadius: "50%",
  },
  dropdown: {
    fontSize: "12px",
    marginLeft: "4px",
  },
  dropdownMenu: {
    position: "absolute",
    top: "50px",
    right: "0",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
    zIndex: 100,
    minWidth: "250px",
  },
  userInfo: {
    padding: "16px",
  },
  userEmail: {
    fontSize: "12px",
    color: "#666",
    margin: "4px 0 0 0",
  },
  userRole: {
    fontSize: "12px",
    color: "#999",
    margin: "4px 0 0 0",
  },
  dropdownDivider: {
    height: "1px",
    backgroundColor: "#eee",
  },
  dropdownItem: {
    display: "block",
    width: "100%",
    padding: "12px 16px",
    border: "none",
    backgroundColor: "transparent",
    cursor: "pointer",
    textAlign: "left",
    color: "#d32f2f",
    fontWeight: "bold",
  },
};

export default Navbar;