import { Link, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header style={styles.header}>
      <div style={styles.container}>
        <Link to="/" style={styles.brandLink}>
          <div style={styles.logoWrapper}>
            <img src={logo} alt="Smart Campus Logo" style={styles.logoImage} />
          </div>

          <div style={styles.brandTextWrap}>
            <h1 style={styles.logoText}>SLIIT Smart Campus</h1>
            <p style={styles.subtitle}>Operations Hub</p>
          </div>
        </Link>

        <nav style={styles.nav}>
          <Link
            to="/"
            style={{
              ...styles.navLink,
              ...(isActive("/") ? styles.activeNavLink : {}),
            }}
          >
            Home
            {isActive("/") && <span style={styles.navUnderline}></span>}
          </Link>

          <Link
            to="/about"
            style={{
              ...styles.navLink,
              ...(isActive("/about") ? styles.activeNavLink : {}),
            }}
          >
            About Us
            {isActive("/about") && <span style={styles.navUnderline}></span>}
          </Link>

          <Link
            to="/facilities"
            style={{
              ...styles.navLink,
              ...(isActive("/facilities") ? styles.activeNavLink : {}),
            }}
          >
            Facilities
            {isActive("/facilities") && (
              <span style={styles.navUnderline}></span>
            )}
          </Link>

          <Link
            to="/report-ticket"
            style={{
              ...styles.navLink,
              ...(isActive("/report-ticket") ? styles.activeNavLink : {}),
            }}
          >
            Report Issue
            {isActive("/report-ticket") && (
              <span style={styles.navUnderline}></span>
            )}
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
    width: "100%",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    background: "rgba(255, 255, 255, 0.96)",
    backdropFilter: "blur(10px)",
    borderBottom: "1px solid rgba(226, 232, 240, 0.9)",
    boxShadow: "0 8px 24px rgba(15, 23, 42, 0.06)",
  },

  container: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "16px 36px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "24px",
    flexWrap: "wrap",
  },

  brandLink: {
    display: "flex",
    alignItems: "center",
    gap: "16px",
    textDecoration: "none",
    minWidth: "fit-content",
  },

  logoWrapper: {
    width: "90px",
    height: "90px",
    borderRadius: "18px",
    background: "#ffffff",
    border: "1px solid #e2e8f0",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
    padding: "8px",
    overflow: "visible",
  },

  logoImage: {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
  },

  brandTextWrap: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },

  logoText: {
    margin: 0,
    color: "#1e3a8a",
    fontSize: "28px",
    fontWeight: "800",
    lineHeight: "1.05",
    letterSpacing: "-0.4px",
  },

  subtitle: {
    margin: "6px 0 0 0",
    color: "#64748b",
    fontSize: "14px",
    fontWeight: "600",
    letterSpacing: "0.2px",
  },

  nav: {
    display: "flex",
    alignItems: "center",
    gap: "28px",
    flexWrap: "wrap",
  },

  navLink: {
    position: "relative",
    textDecoration: "none",
    color: "#475569",
    fontWeight: "700",
    fontSize: "16px",
    padding: "8px 0",
    transition: "all 0.25s ease",
  },

  activeNavLink: {
    color: "#1e3a8a",
  },

  navUnderline: {
    position: "absolute",
    left: 0,
    bottom: "-6px",
    width: "100%",
    height: "3px",
    borderRadius: "999px",
    background: "linear-gradient(90deg, #1e3a8a, #3b82f6)",
  },

  loginBtn: {
    textDecoration: "none",
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    color: "#ffffff",
    fontWeight: "800",
    fontSize: "16px",
    padding: "12px 22px",
    borderRadius: "14px",
    boxShadow: "0 10px 18px rgba(30, 58, 138, 0.22)",
    marginLeft: "4px",
  },
};

export default Navbar;