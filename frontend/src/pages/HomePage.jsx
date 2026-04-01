import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import HeroSection from "../components/HeroSection";
import Footer from "../components/Footer";

function HomePage() {
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

      <section style={styles.features}>
        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Facilities Catalogue</h3>
          <p style={styles.cardText}>
            View and browse lecture halls, labs, meeting rooms, and equipment.
          </p>
        </div>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>Resource Management</h3>
          <p style={styles.cardText}>
            Admins can add, update, remove, and monitor resource availability.
          </p>
        </div>

        <div style={styles.card}>
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
  features: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "20px",
    padding: "40px 50px 20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
    borderLeft: "5px solid #f4b400",
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