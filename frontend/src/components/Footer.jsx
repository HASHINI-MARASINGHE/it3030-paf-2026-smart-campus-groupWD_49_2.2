import { useMemo, useState } from "react";

function Footer() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const today = new Date();

  const monthLabel = useMemo(() => {
    return currentDate.toLocaleString("default", {
      month: "long",
      year: "numeric",
    });
  }, [currentDate]);

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let firstDayIndex = firstDayOfMonth.getDay();
    firstDayIndex = firstDayIndex === 0 ? 6 : firstDayIndex - 1;

    const cells = [];

    for (let i = 0; i < firstDayIndex; i++) {
      cells.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      cells.push(day);
    }

    return cells;
  }, [currentDate]);

  const highlightedDates = useMemo(() => {
    return [3, 10, 12, 13, 14, 15, 16];
  }, []);

  const goToPreviousMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1)
    );
  };

  const goToNextMonth = () => {
    setCurrentDate(
      new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1)
    );
  };

  const isToday = (day) => {
    return (
      day === today.getDate() &&
      currentDate.getMonth() === today.getMonth() &&
      currentDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <footer style={styles.footer}>
      <div style={styles.topSection}>
        <div style={styles.supportSection}>
          <p style={styles.smallHeading}>DO YOU NEED ANY</p>
          <h2 style={styles.mainHeading}>SUPPORT ?</h2>

          <a
            href="https://support.sliit.lk/"
            target="_blank"
            rel="noreferrer"
            style={styles.contactLink}
          >
            <span style={styles.contactEmoji}>🌐</span>
            <span>support.sliit.lk</span>
          </a>

          <a href="tel:+94117544801" style={styles.contactLink}>
            <span style={styles.contactEmoji}>📞</span>
            <span>+94 11 754 4801</span>
          </a>

          <a
            href="https://www.sliit.lk/service-feedback-form/"
            target="_blank"
            rel="noreferrer"
            style={styles.feedbackButton}
          >
            Provide Feedback to SLIIT
          </a>
        </div>

        <div style={styles.calendarSection}>
          <h3 style={styles.calendarTitle}>Calendar</h3>
          <div style={styles.calendarUnderline}></div>

          <div style={styles.monthRow}>
            <button
              type="button"
              onClick={goToPreviousMonth}
              style={styles.monthArrowButton}
              aria-label="Previous month"
            >
              ◀
            </button>

            <span style={styles.monthText}>{monthLabel}</span>

            <button
              type="button"
              onClick={goToNextMonth}
              style={styles.monthArrowButton}
              aria-label="Next month"
            >
              ▶
            </button>
          </div>

          <div style={styles.calendarGrid}>
            {days.map((day) => (
              <div key={day} style={styles.dayLabel}>
                {day}
              </div>
            ))}

            {calendarDays.map((day, index) => {
              if (day === null) {
                return <div key={`empty-${index}`} style={styles.emptyCell}></div>;
              }

              const showDot = highlightedDates.includes(day) && !isToday(day);

              return (
                <div
                  key={day}
                  style={{
                    ...styles.dateCell,
                    ...(isToday(day) ? styles.activeDate : {}),
                  }}
                >
                  <span>{day}</span>
                  {showDot && <div style={styles.dot}></div>}
                </div>
              );
            })}
          </div>

          <p style={styles.fullCalendar}>Full calendar</p>
        </div>
      </div>

      <div style={styles.bottomSection}>
        <div style={styles.bottomLeft}>
          <p style={styles.bottomText}>
            Website protected by advanced security measures. Unauthorized use is prohibited.
          </p>
          <p style={styles.bottomText}>
            Copyright © 2026 SLIIT — All Rights Reserved
          </p>

          <div style={styles.linksBlock}>
            <p style={styles.linkLine}>Reset user tour on this page</p>
            <p style={styles.linkLine}>Data retention summary</p>
            <p style={styles.linkLine}>Get the mobile app</p>
          </div>
        </div>

        <div style={styles.socialRow}>
          <a
            href="https://web.facebook.com/sliit.lk/?_rdc=1&_rdr#"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.socialCircle, backgroundColor: "#1d9bf0" }}
            aria-label="SLIIT Facebook"
            title="SLIIT Facebook"
          >
            f
          </a>

          <a
            href="https://www.instagram.com/sliit.life/"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.socialCircle, backgroundColor: "#e1306c" }}
            aria-label="SLIIT Instagram"
            title="SLIIT Instagram"
          >
            ◎
          </a>

          <a
            href="https://www.linkedin.com/school/sliit/posts/?feedView=all"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.socialCircle, backgroundColor: "#0a66c2" }}
            aria-label="SLIIT LinkedIn"
            title="SLIIT LinkedIn"
          >
            in
          </a>

          <a
            href="https://www.youtube.com/user/SLIITtube"
            target="_blank"
            rel="noreferrer"
            style={{ ...styles.socialCircle, backgroundColor: "#ff0033" }}
            aria-label="SLIIT YouTube"
            title="SLIIT YouTube"
          >
            ▶
          </a>
        </div>
      </div>
    </footer>
  );
}

const styles = {
  footer: {
    marginTop: "50px",
    backgroundColor: "#263445",
    color: "#fff",
  },
  topSection: {
    display: "grid",
    gridTemplateColumns: "1.3fr 1fr",
    gap: "32px",
    padding: "32px 50px",
  },
  supportSection: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
  },
  smallHeading: {
    color: "#d1d5db",
    fontWeight: "bold",
    fontSize: "13px",
    letterSpacing: "1px",
    marginBottom: "10px",
  },
  mainHeading: {
    fontSize: "34px",
    margin: "0 0 14px 0",
    color: "#e5e7eb",
  },
  contactLink: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    fontSize: "18px",
    marginBottom: "12px",
    color: "#f4b400",
    textDecoration: "none",
    width: "fit-content",
  },
  contactEmoji: {
    fontSize: "24px",
    lineHeight: 1,
  },
  feedbackButton: {
    marginTop: "12px",
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
    width: "fit-content",
    textDecoration: "none",
    display: "inline-block",
    fontSize: "15px",
  },
  calendarSection: {},
  calendarTitle: {
    fontSize: "20px",
    marginBottom: "6px",
  },
  calendarUnderline: {
    width: "70px",
    height: "3px",
    backgroundColor: "#f4b400",
    marginBottom: "16px",
  },
  monthRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "14px",
    fontWeight: "bold",
    gap: "12px",
  },
  monthArrowButton: {
    background: "transparent",
    border: "none",
    color: "#f4b400",
    cursor: "pointer",
    fontSize: "18px",
    fontWeight: "bold",
  },
  monthText: {
    fontSize: "18px",
    textAlign: "center",
    flex: 1,
  },
  calendarGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(7, 1fr)",
    gap: "6px",
    alignItems: "center",
  },
  dayLabel: {
    textAlign: "center",
    color: "#d1d5db",
    fontWeight: "bold",
    fontSize: "14px",
    paddingBottom: "4px",
  },
  emptyCell: {
    minHeight: "34px",
  },
  dateCell: {
    textAlign: "center",
    padding: "6px 0",
    position: "relative",
    color: "#e5e7eb",
    minHeight: "34px",
    fontSize: "15px",
  },
  activeDate: {
    backgroundColor: "#f4c542",
    color: "#1f2f6b",
    borderRadius: "999px",
    width: "34px",
    height: "34px",
    margin: "0 auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontWeight: "bold",
  },
  dot: {
    width: "5px",
    height: "5px",
    borderRadius: "50%",
    backgroundColor: "#f4b400",
    position: "absolute",
    left: "50%",
    transform: "translateX(-50%)",
    bottom: "2px",
  },
  fullCalendar: {
    color: "#f4b400",
    fontWeight: "bold",
    marginTop: "18px",
    cursor: "pointer",
    fontSize: "15px",
  },
  bottomSection: {
    borderTop: "1px solid rgba(255,255,255,0.08)",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "24px",
    padding: "26px 50px",
    flexWrap: "wrap",
  },
  bottomLeft: {
    flex: 1,
    minWidth: "260px",
  },
  bottomText: {
    color: "#d1d5db",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "8px",
    lineHeight: "1.6",
  },
  linksBlock: {
    marginTop: "12px",
  },
  linkLine: {
    color: "#f4b400",
    fontSize: "14px",
    marginBottom: "8px",
    cursor: "pointer",
  },
  socialRow: {
    display: "flex",
    gap: "12px",
    alignItems: "center",
    flexWrap: "wrap",
  },
  socialCircle: {
    width: "42px",
    height: "42px",
    borderRadius: "50%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    color: "#fff",
    fontWeight: "bold",
    fontSize: "18px",
    border: "2px solid rgba(255,255,255,0.7)",
    textDecoration: "none",
  },
};

export default Footer;