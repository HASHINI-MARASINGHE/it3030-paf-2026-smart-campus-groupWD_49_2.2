import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

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

        <Link
          to="/facilities"
          style={{
            ...styles.navLink,
            ...(isActive("/facilities") ? styles.activeNavLink : {}),
          }}
        >
          Facilities
        </Link>

        <Link to="/login" style={styles.loginBtn}>
          Login
        </Link>
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
};

export default Navbar;