import campusImg from "../assets/images/SLIIT.jpg";

function HeroSection({ title, text, compact = false }) {
  return (
    <section
      style={{
        ...styles.hero,
        padding: compact ? "80px 20px" : "120px 20px",
        backgroundImage: `url(${campusImg})`,
      }}
    >
      <div style={styles.overlay}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>{title}</h1>
          <p style={styles.heroText}>{text}</p>
        </div>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    minHeight: "380px",
    backgroundSize: "cover",
    backgroundPosition: "center",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    textAlign: "center",
  },

  // ✅ FULL OVERLAY (not box anymore)
  overlay: {
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0,0,0,0.45)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "40px 20px",
  },

  heroContent: {
    maxWidth: "900px",
  },

  heroTitle: {
    fontSize: "48px",
    marginBottom: "16px",
    fontWeight: "bold",
  },

  heroText: {
    fontSize: "18px",
    lineHeight: "1.6",
  },
};

export default HeroSection;