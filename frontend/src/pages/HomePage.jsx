import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

import labImg from "../assets/images/lab.jpg";
import ownerImg from "../assets/images/owner.jpg";
import studentsImg from "../assets/images/students.jpg";

function HomePage() {
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();

  const handleHomeSearch = () => {
    const value = searchText.trim();

    if (!value) {
      navigate("/facilities");
      return;
    }

    navigate(`/facilities?search=${encodeURIComponent(value)}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleHomeSearch();
    }
  };

  return (
    <div style={styles.page}>
      <Navbar />

      <HeroSection
        title="Welcome to the Smart Campus Operations Hub"
        text="Manage campus facilities, rooms, labs, and university resources in one place. This system helps administrators maintain resources efficiently and supports better campus operations."
      />

      <section style={styles.actionSection}>
        <div style={styles.heroButtons}>
          <Link to="/facilities" style={styles.secondaryBtn}>
            Browse Facilities
          </Link>
          <Link to="/login" style={styles.primaryBtn}>
            Login to Continue
          </Link>
        </div>
      </section>

      <section style={styles.searchSection}>
        <div style={styles.searchBox}>
          <input
            type="text"
            placeholder="Search facilities, labs, rooms..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={handleKeyDown}
            style={styles.searchInput}
          />
          <button onClick={handleHomeSearch} style={styles.searchBtn}>
            Search
          </button>
        </div>
      </section>

      <section style={styles.statsSection}>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>50+</h3>
          <p style={styles.statLabel}>Campus Resources</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>24/7</h3>
          <p style={styles.statLabel}>Access to Information</p>
        </div>
        <div style={styles.statCard}>
          <h3 style={styles.statNumber}>1</h3>
          <p style={styles.statLabel}>Centralized Platform</p>
        </div>
      </section>

      <section style={styles.featuresSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTag}>Core Features</p>
          <h2 style={styles.sectionTitle}>Everything you need in one smart platform</h2>
          <p style={styles.sectionText}>
            Explore facilities, manage university resources, and provide a better
            operational experience through one clean and modern system.
          </p>
        </div>

        <div style={styles.features}>
          <div style={styles.card}>
            <img src={labImg} alt="Facilities" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Facilities Catalogue</h3>
            <p style={styles.cardText}>
              View and browse lecture halls, labs, meeting rooms, and equipment.
            </p>
          </div>

          <div style={styles.card}>
            <img
              src={ownerImg}
              alt="Resource Management"
              style={styles.cardImage}
            />
            <h3 style={styles.cardTitle}>Resource Management</h3>
            <p style={styles.cardText}>
              Admins can add, update, remove, and monitor resource availability.
            </p>
          </div>

          <div style={styles.card}>
            <img
              src={studentsImg}
              alt="Campus Ready UI"
              style={styles.cardImage}
            />
            <h3 style={styles.cardTitle}>Campus Ready UI</h3>
            <p style={styles.cardText}>
              A clean design inspired by the university system style and colors.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.workflowSection}>
        <div style={styles.sectionHeader}>
          <p style={styles.sectionTag}>How It Works</p>
          <h2 style={styles.sectionTitle}>Simple process for better campus operations</h2>
        </div>

        <div style={styles.workflowGrid}>
          <div style={styles.workflowCard}>
            <div style={styles.workflowBadge}>01</div>
            <h3 style={styles.workflowTitle}>Search Resources</h3>
            <p style={styles.workflowText}>
              Quickly search available facilities, labs, rooms, and campus spaces.
            </p>
          </div>

          <div style={styles.workflowCard}>
            <div style={styles.workflowBadge}>02</div>
            <h3 style={styles.workflowTitle}>Check Availability</h3>
            <p style={styles.workflowText}>
              View key details such as location, type, capacity, and current status.
            </p>
          </div>

          <div style={styles.workflowCard}>
            <div style={styles.workflowBadge}>03</div>
            <h3 style={styles.workflowTitle}>Manage Efficiently</h3>
            <p style={styles.workflowText}>
              Support better planning and smoother university operations through a centralized system.
            </p>
          </div>
        </div>
      </section>

      <section style={styles.ctaSection}>
        <div style={styles.ctaBox}>
          <div>
            <p style={styles.ctaTag}>Get Started Today</p>
            <h2 style={styles.ctaTitle}>Explore facilities and manage campus resources with ease</h2>
            <p style={styles.ctaText}>
              Access the catalogue, discover available spaces, and use the platform
              to support smarter campus management.
            </p>
          </div>

          <div style={styles.ctaButtons}>
            <Link to="/facilities" style={styles.ctaSecondaryBtn}>
              View Facilities
            </Link>
            <Link to="/login" style={styles.ctaPrimaryBtn}>
              Admin Login
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background:
      "linear-gradient(180deg, #f8fafc 0%, #f1f5f9 45%, #eef2f7 100%)",
  },

  actionSection: {
    marginTop: "-10px",
    padding: "0 50px 14px",
    display: "flex",
    justifyContent: "center",
  },
  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "-30px",
    position: "relative",
    zIndex: 2,
  },
  primaryBtn: {
    background: "linear-gradient(135deg, #f4b400, #f59e0b)",
    color: "#1f2f6b",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: "800",
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(244, 180, 0, 0.25)",
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    color: "#1f2f6b",
    padding: "14px 24px",
    borderRadius: "12px",
    fontWeight: "800",
    textDecoration: "none",
    boxShadow: "0 8px 18px rgba(15, 23, 42, 0.08)",
    border: "1px solid #dbe3ee",
  },

  searchSection: {
    display: "flex",
    justifyContent: "center",
    padding: "14px 20px 0",
  },
  searchBox: {
    width: "100%",
    maxWidth: "760px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: "280px",
    padding: "15px 16px",
    borderRadius: "14px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    outline: "none",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 18px rgba(15, 23, 42, 0.05)",
  },
  searchBtn: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "15px 24px",
    borderRadius: "14px",
    cursor: "pointer",
    fontWeight: "800",
    boxShadow: "0 8px 18px rgba(31, 47, 107, 0.18)",
  },

  statsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
    padding: "34px 50px 10px",
  },
  statCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "26px 20px",
    textAlign: "center",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
    border: "1px solid #edf2f7",
  },
  statNumber: {
    margin: "0 0 8px 0",
    fontSize: "34px",
    fontWeight: "800",
    color: "#1e3a8a",
  },
  statLabel: {
    margin: 0,
    color: "#64748b",
    fontWeight: "700",
    fontSize: "15px",
  },

  featuresSection: {
    padding: "36px 50px 10px",
  },
  sectionHeader: {
    textAlign: "center",
    maxWidth: "820px",
    margin: "0 auto 28px",
  },
  sectionTag: {
    margin: "0 0 8px 0",
    color: "#f59e0b",
    fontWeight: "800",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
  },
  sectionTitle: {
    margin: "0 0 10px 0",
    color: "#1e3a8a",
    fontSize: "34px",
    fontWeight: "800",
    lineHeight: "1.2",
  },
  sectionText: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.7",
  },

  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    border: "1px solid #eef2f7",
    overflow: "hidden",
  },
  cardImage: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  cardTitle: {
    color: "#1f2f6b",
    margin: "0 0 10px 0",
    fontSize: "24px",
    fontWeight: "800",
  },
  cardText: {
    color: "#475569",
    lineHeight: "1.7",
    margin: 0,
    fontSize: "15px",
  },

  workflowSection: {
    padding: "36px 50px 10px",
  },
  workflowGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
    gap: "24px",
  },
  workflowCard: {
    backgroundColor: "#ffffff",
    borderRadius: "20px",
    padding: "24px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.07)",
    border: "1px solid #edf2f7",
  },
  workflowBadge: {
    width: "46px",
    height: "46px",
    borderRadius: "50%",
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    color: "#ffffff",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontWeight: "800",
    marginBottom: "14px",
  },
  workflowTitle: {
    margin: "0 0 10px 0",
    color: "#1e3a8a",
    fontSize: "22px",
    fontWeight: "800",
  },
  workflowText: {
    margin: 0,
    color: "#64748b",
    lineHeight: "1.7",
    fontSize: "15px",
  },

  ctaSection: {
    padding: "40px 50px 10px",
  },
  ctaBox: {
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    color: "#ffffff",
    borderRadius: "24px",
    padding: "34px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    flexWrap: "wrap",
    boxShadow: "0 16px 34px rgba(31, 47, 107, 0.20)",
  },
  ctaTag: {
    margin: "0 0 8px 0",
    color: "#f4b400",
    fontWeight: "800",
    fontSize: "13px",
    textTransform: "uppercase",
    letterSpacing: "1.2px",
  },
  ctaTitle: {
    margin: "0 0 10px 0",
    fontSize: "32px",
    fontWeight: "800",
    lineHeight: "1.2",
    maxWidth: "720px",
  },
  ctaText: {
    margin: 0,
    color: "rgba(255,255,255,0.88)",
    lineHeight: "1.7",
    fontSize: "16px",
    maxWidth: "720px",
  },
  ctaButtons: {
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
  },
  ctaPrimaryBtn: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: "800",
    textDecoration: "none",
  },
  ctaSecondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: "800",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.25)",
  },
};

export default HomePage;