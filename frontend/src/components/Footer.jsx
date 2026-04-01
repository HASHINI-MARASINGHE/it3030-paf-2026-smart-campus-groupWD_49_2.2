function Footer() {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const dates = Array.from({ length: 30 }, (_, i) => i + 1);
  const highlightedDates = [3, 10, 12, 13, 14, 15, 16];

  return (
    <footer style={styles.footer}>
      <div style={styles.topSection}>
        <div style={styles.supportSection}>
          <p style={styles.smallHeading}>DO YOU NEED ANY</p>
          <h2 style={styles.mainHeading}>SUPPORT ?</h2>

          <p style={styles.contactItem}>🌐 support.sliit.lk</p>
          <p style={styles.contactItem}>📞 +94 11 754 4801</p>

          <button style={styles.feedbackButton}>Provide Feedback to SLIIT</button>
        </div>

        <div style={styles.calendarSection}>
          <h3 style={styles.calendarTitle}>Calendar</h3>
          <div style={styles.calendarUnderline}></div>

          <div style={styles.monthRow}>
            <span style={styles.monthArrow}>◀</span>
            <span style={styles.monthText}>April 2026</span>
            <span style={styles.monthArrow}>▶</span>
          </div>

          <div style={styles.calendarGrid}>
            {days.map((day) => (
              <div key={day} style={styles.dayLabel}>
                {day}
              </div>
            ))}

            {dates.map((date) => (
              <div
                key={date}
                style={{
                  ...styles.dateCell,
                  ...(date === 1 ? styles.activeDate : {}),
                }}
              >
                <span>{date}</span>
                {highlightedDates.includes(date) && date !== 1 && (
                  <div style={styles.dot}></div>
                )}
              </div>
            ))}
          </div>

          <p style={styles.fullCalendar}>Full calendar</p>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div>
          <p style={styles.bottomText}>
            Website protected by advanced security measures. Unauthorized use is prohibited.
          </p>
          <p style={styles.bottomText}>Copyright © 2026 SLIIT — All Rights Reserved</p>

          <div style={styles.linksBlock}>
            <p style={styles.linkLine}>Reset user tour on this page</p>
            <p style={styles.linkLine}>Data retention summary</p>
            <p style={styles.linkLine}>Get the mobile app</p>
          </div>
        </div>

        <div style={styles.socialRow}>
          <div style={{ ...styles.socialCircle, backgroundColor: "#1d9bf0" }}>f</div>
          <div style={{ ...styles.socialCircle, backgroundColor: "#e1306c" }}>◎</div>
          <div style={{ ...styles.socialCircle, backgroundColor: "#0a66c2" }}>in</div>
          <div style={{ ...styles.socialCircle, backgroundColor: "#ff0033" }}>▶</div>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "60px",
    backgroundColor: "#263445",
    color: "#fff",
  },
  topSection: {
    display: "grid",
    gridTemplateColumns: "1.5fr 1fr",
    gap: "40px",
    padding: "55px 70px",
  },
  supportSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  smallHeading: {
    color: "#d1d5db",
    fontWeight: "bold",
    fontSize: "15px",
    letterSpacing: "1px",
    marginBottom: "14px",
  },
  mainHeading: {
    fontSize: "52px",
    margin: "0 0 18px 0",
    color: "#e5e7eb",
  },
  contactItem: {
    fontSize: "28px",
    marginBottom: "16px",
    color: "#f4b400",
  },
  feedbackButton: {
    marginTop: "18px",
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    padding: "14px 22px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "fit-content",
  },
  calendarSection: {},
  calendarTitle: {
    fontSize: "24px",
    marginBottom: "8px",
  },
  calendarUnderline: {
    width: "90px",
    height: "4px",
    backgroundColor: "#f4b400",
    marginBottom: "24px",
  },
  monthRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "18px",
    fontWeight: "bold",
  },
  monthArrow: {
    color: "#f4b400",
    cursor: "pointer",
  },
  monthText: {
    fontSize: "22px",
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "10px",
    alignItems: "center",
  },
  dayLabel: {
    textAlign: "center",
    color: "#d1d5db",
    fontWeight: "bold",
    paddingBottom: "6px",
  },
  dateCell: {
    textAlign: "center",
    padding: "10px 0",
    position: "relative",
    color: "#e5e7eb",
    minHeight: "42px",
  },
  activeDate: {
    backgroundColor: "#f4c542",
    color: "#1f2f6b",
    borderRadius: "999px",
    width: "42px",
    height: "42px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  dot: {
    width: "6px",
    height: "6px",
    borderRadius: "50%",
    backgroundColor: "#f4b400",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "4px",
  },
  fullCalendar: {
    color: "#f4b400",
    fontWeight: "bold",
    marginTop: "28px",
    cursor: "pointer",
  },
  bottomSection: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "30px",
    padding: "40px 70px",
    flexWrap: "wrap",
  },
  bottomText: {
    color: "#d1d5db",
    fontSize: "20px",
    fontWeight: "600",
    marginBottom: "12px",
  },
  linksBlock: {
    marginTop: "20px",
  },
  linkLine: {
    color: "#f4b400",
    fontSize: "18px",
    marginBottom: "10px",
    cursor: "pointer",
  },
  socialRow: {
    display: "flex",
    gap: "14px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  socialCircle: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "22px",
    border: "3px solid rgba(255,255,255,0.7)",
  },
};

export default Footer;