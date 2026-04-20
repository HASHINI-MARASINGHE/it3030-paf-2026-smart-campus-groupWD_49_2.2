import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

import labImg from "../assets/images/lab.jpg";
import ownerImg from "../assets/images/owner.jpg";
import studentsImg from "../assets/images/students.jpg";

function AboutPage() {
  return (
    <div style={styles.page}>
      <Navbar />

      <section style={styles.heroSection}>
        <div style={styles.heroOverlay}>
          <div style={styles.heroContent}>
            <p style={styles.heroTag}>About Smart Campus</p>
            <h1 style={styles.heroTitle}>Building a smarter university experience</h1>
            <p style={styles.heroText}>
              The SLIIT Smart Campus Operations Hub is designed to support
              better campus management by helping users explore facilities,
              monitor resources, and improve day-to-day operational efficiency.
            </p>
          </div>
        </div>
      </section>

      <main style={styles.main}>
        <section style={styles.introSection}>
          <div style={styles.sectionHeader}>
            <p style={styles.sectionTag}>Who We Are</p>
            <h2 style={styles.sectionTitle}>A platform designed for smarter campus operations</h2>
            <p style={styles.sectionText}>
              This system was developed to provide a centralized platform for
              managing campus facilities and resources. It supports a more
              organized and accessible approach to viewing university spaces,
              monitoring availability, and improving overall campus operations.
            </p>
          </div>
        </section>

        <section style={styles.cardsSection}>
          <div style={styles.infoCard}>
            <img src={labImg} alt="Modern facilities" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Our Mission</h3>
            <p style={styles.cardText}>
              To simplify the way university facilities and campus resources are
              accessed and managed through one modern digital platform.
            </p>
          </div>

          <div style={styles.infoCard}>
            <img src={ownerImg} alt="Resource management" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Our Vision</h3>
            <p style={styles.cardText}>
              To create a more efficient, connected, and student-friendly smart
              campus environment that supports better decision-making and planning.
            </p>
          </div>

          <div style={styles.infoCard}>
            <img src={studentsImg} alt="Campus users" style={styles.cardImage} />
            <h3 style={styles.cardTitle}>Our Users</h3>
            <p style={styles.cardText}>
              This platform is useful for administrators, staff, and students
              who need quick access to facility information and campus resources.
            </p>
          </div>
        </section>

        <section style={styles.highlightSection}>
          <div style={styles.highlightBox}>
            <div style={styles.highlightItem}>
              <h3 style={styles.highlightNumber}>01</h3>
              <h4 style={styles.highlightTitle}>Centralized Access</h4>
              <p style={styles.highlightText}>
                View facilities, rooms, and resources in one place without
                confusion or manual searching.
              </p>
            </div>

            <div style={styles.highlightItem}>
              <h3 style={styles.highlightNumber}>02</h3>
              <h4 style={styles.highlightTitle}>Better Resource Visibility</h4>
              <p style={styles.highlightText}>
                Understand availability, type, capacity, and status with a clean
                and user-friendly interface.
              </p>
            </div>

            <div style={styles.highlightItem}>
              <h3 style={styles.highlightNumber}>03</h3>
              <h4 style={styles.highlightTitle}>Improved Campus Efficiency</h4>
              <p style={styles.highlightText}>
                Support smarter operational planning and better facility
                management across the university environment.
              </p>
            </div>
          </div>
        </section>

        <section style={styles.ctaSection}>
          <div style={styles.ctaBox}>
            <div>
              <p style={styles.ctaTag}>Explore the Platform</p>
              <h2 style={styles.ctaTitle}>Discover facilities and experience smarter campus management</h2>
              <p style={styles.ctaText}>
                Browse available university spaces and see how the Smart Campus
                Operations Hub supports a better digital campus experience.
              </p>
            </div>

            <div style={styles.ctaButtons}>
              <Link to="/facilities" style={styles.secondaryBtn}>
                View Facilities
              </Link>
              <Link to="/login" style={styles.primaryBtn}>
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

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

  heroSection: {
    height: "260px",
    backgroundImage:
      "linear-gradient(135deg, rgba(15, 23, 42, 0.72), rgba(30, 58, 138, 0.56)), url('/src/assets/SLIIT.jpg')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  },
  heroOverlay: {
    width: "100%",
    height: "100%",
    display: "flex",
    alignItems: "center",
  },
  heroContent: {
    padding: "0 50px",
    maxWidth: "900px",
  },
  heroTag: {
    margin: "0 0 10px 0",
    color: "#f4b400",
    fontSize: "13px",
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: "1.3px",
  },
  heroTitle: {
    margin: "0 0 12px 0",
    color: "#ffffff",
    fontSize: "46px",
    lineHeight: "1.1",
    fontWeight: "800",
    letterSpacing: "-0.8px",
  },
  heroText: {
    margin: 0,
    color: "rgba(255,255,255,0.92)",
    fontSize: "17px",
    lineHeight: "1.7",
    maxWidth: "760px",
  },

  main: {
    padding: "40px 50px 30px",
  },

  introSection: {
    marginBottom: "30px",
  },
  sectionHeader: {
    maxWidth: "850px",
    margin: "0 auto",
    textAlign: "center",
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
    margin: "0 0 12px 0",
    color: "#1e3a8a",
    fontSize: "36px",
    fontWeight: "800",
    lineHeight: "1.2",
  },
  sectionText: {
    margin: 0,
    color: "#64748b",
    fontSize: "16px",
    lineHeight: "1.8",
  },

  cardsSection: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "24px",
    marginBottom: "34px",
  },
  infoCard: {
    backgroundColor: "#ffffff",
    borderRadius: "22px",
    padding: "20px",
    boxShadow: "0 10px 24px rgba(15, 23, 42, 0.08)",
    border: "1px solid #eef2f7",
  },
  cardImage: {
    width: "100%",
    height: "190px",
    objectFit: "cover",
    borderRadius: "14px",
    marginBottom: "16px",
  },
  cardTitle: {
    margin: "0 0 10px 0",
    color: "#1e3a8a",
    fontSize: "24px",
    fontWeight: "800",
  },
  cardText: {
    margin: 0,
    color: "#475569",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  highlightSection: {
    marginBottom: "34px",
  },
  highlightBox: {
    backgroundColor: "#ffffff",
    borderRadius: "24px",
    padding: "30px",
    boxShadow: "0 12px 26px rgba(15, 23, 42, 0.08)",
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "24px",
    border: "1px solid #eef2f7",
  },
  highlightItem: {
    padding: "8px 4px",
  },
  highlightNumber: {
    margin: "0 0 10px 0",
    color: "#f4b400",
    fontSize: "30px",
    fontWeight: "800",
  },
  highlightTitle: {
    margin: "0 0 10px 0",
    color: "#1e3a8a",
    fontSize: "22px",
    fontWeight: "800",
  },
  highlightText: {
    margin: 0,
    color: "#64748b",
    fontSize: "15px",
    lineHeight: "1.7",
  },

  ctaSection: {
    marginBottom: "10px",
  },
  ctaBox: {
    background: "linear-gradient(135deg, #1e3a8a, #1f2f6b)",
    borderRadius: "24px",
    padding: "34px",
    color: "#ffffff",
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
  primaryBtn: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: "800",
    textDecoration: "none",
  },
  secondaryBtn: {
    backgroundColor: "rgba(255,255,255,0.12)",
    color: "#ffffff",
    padding: "14px 22px",
    borderRadius: "12px",
    fontWeight: "800",
    textDecoration: "none",
    border: "1px solid rgba(255,255,255,0.25)",
  },
};

export default AboutPage;