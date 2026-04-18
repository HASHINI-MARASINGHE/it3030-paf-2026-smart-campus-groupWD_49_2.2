import { Link, useLocation } from "react-router-dom";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <div style={styles.brandSection}>
          <Link to="/" style={styles.brandLink}>
            <h1 style={styles.logo}>SLIIT Smart Campus</h1>
            <p style={styles.subtitle}>Operations Hub</p>
          </Link>
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
            to="/about"
            style={{
              ...styles.navLink,
              ...(isActive("/about") ? styles.activeNavLink : {}),
            }}
          >
            About Us
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

          <Link
            to="/report-ticket"
            style={{
              ...styles.navLink,
              ...(isActive("/report-ticket") ? styles.activeNavLink : {}),
            }}
          >
            Report Issue
          </Link>

          <Link to="/login" style={styles.loginBtn}>
            Login
          </Link>
        </nav>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: "sticky",
    top: 0,
    zIndex: 1000,
    backgroundColor: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid #e5e7eb",
    boxShadow: "0 6px 20px rgba(15, 23, 42, 0.05)",
  },
  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "18px 50px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "18px",
    flexWrap: "wrap",
  },
  brandSection: {
    display: "flex",
    alignItems: "center",
  },
  brandLink: {
    textDecoration: "none",
  },
  logo: {
    color: "#1e3a8a",
    fontSize: "36px",
    fontWeight: "800",
    margin: 0,
    letterSpacing: "-0.5px",
    lineHeight: 1.1,
  },
  subtitle: {
    color: "#64748b",
    marginTop: "6px",
    marginBottom: 0,
    fontSize: "16px",
    fontWeight: "500",
  },
  nav: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  navLink: {
    fontWeight: "700",
    color: "#334155",
    textDecoration: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    transition: "all 0.2s ease",
    fontSize: "16px",
  },
  activeNavLink: {
    backgroundColor: "#eef2ff",
    color: "#1e3a8a",
    boxShadow: "inset 0 0 0 1px #c7d2fe",
  },
  loginBtn: {
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    color: "#fff",
    padding: "12px 22px",
    borderRadius: "12px",
    fontWeight: "700",
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(31, 47, 107, 0.22)",
  },
};

export default Navbar;