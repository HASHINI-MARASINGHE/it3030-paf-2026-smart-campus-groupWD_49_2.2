function HeroSection({ title, text, compact = false }) {
  return (
    <section
      style={{
        ...styles.hero,
        padding: compact ? "70px 50px" : "90px 50px",
      }}
    >
      <div style={styles.heroContent}>
        <h2 style={styles.heroTitle}>{title}</h2>
        <p style={styles.heroText}>{text}</p>
      </div>
    </section>
  );
}

const styles = {
  hero: {
    background: "linear-gradient(135deg, #1f2f6b, #37424a)",
    color: "#fff",
    textAlign: "center",
  },
  heroContent: {
    maxWidth: "950px",
    margin: "0 auto",
  },
  heroTitle: {
    fontSize: "44px",
    marginBottom: "18px",
  },
  heroText: {
    fontSize: "18px",
    lineHeight: "1.7",
    maxWidth: "850px",
    margin: "0 auto",
  },
};

export default HeroSection;