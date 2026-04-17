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

      <section style={styles.features}>
        <div style={styles.card}>
          <img src={labImg} alt="Facilities" style={styles.cardImage} />
          <h3 style={styles.cardTitle}>Facilities Catalogue</h3>
          <p style={styles.cardText}>
            View and browse lecture halls, labs, meeting rooms, and equipment.
          </p>
        </div>

        <div style={styles.card}>
          <img src={ownerImg} alt="Resource Management" style={styles.cardImage} />
          <h3 style={styles.cardTitle}>Resource Management</h3>
          <p style={styles.cardText}>
            Admins can add, update, remove, and monitor resource availability.
          </p>
        </div>

        <div style={styles.card}>
          <img src={studentsImg} alt="Campus Ready UI" style={styles.cardImage} />
          <h3 style={styles.cardTitle}>Campus Ready UI</h3>
          <p style={styles.cardText}>
            A clean design inspired by the university system style and colors.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#f5f6f8",
  },
  actionSection: {
    marginTop: "-10px",
    padding: "0 50px 10px",
    display: "flex",
    justifyContent: "center",
  },
  heroButtons: {
    display: "flex",
    justifyContent: "center",
    gap: "14px",
    flexWrap: "wrap",
    marginTop: "-30px",
  },
  primaryBtn: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "14px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  secondaryBtn: {
    backgroundColor: "#ffffff",
    color: "#1f2f6b",
    padding: "14px 24px",
    borderRadius: "8px",
    fontWeight: "bold",
    textDecoration: "none",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  searchSection: {
    display: "flex",
    justifyContent: "center",
    padding: "10px 20px 0",
  },
  searchBox: {
    width: "100%",
    maxWidth: "700px",
    display: "flex",
    gap: "12px",
    flexWrap: "wrap",
    justifyContent: "center",
  },
  searchInput: {
    flex: 1,
    minWidth: "280px",
    padding: "14px 16px",
    borderRadius: "10px",
    border: "1px solid #d1d5db",
    fontSize: "16px",
    outline: "none",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
  },
  searchBtn: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    border: "none",
    padding: "14px 22px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "bold",
  },
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    padding: "40px 50px 20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #f4b400",
  },
  cardImage: {
    width: "100%",
    height: "180px",
    objectFit: "cover",
    borderRadius: "10px",
    marginBottom: "14px",
  },
  cardTitle: {
    color: "#1f2f6b",
    marginBottom: "10px",
  },
  cardText: {
    color: "#444",
    lineHeight: "1.6",
  },
};

export default HomePage;