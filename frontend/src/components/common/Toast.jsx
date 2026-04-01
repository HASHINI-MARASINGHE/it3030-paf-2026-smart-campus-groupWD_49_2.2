import { useEffect } from "react";

function Toast({ message, type = "success", onClose }) {
  useEffect(() => {
    if (!message) return;

    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [message, onClose]);

  if (!message) return null;

  return (
    <div
      style={{
        ...styles.toast,
        ...(type === "success" ? styles.success : styles.error),
      }}
    >
      <div style={styles.content}>
        <span style={styles.icon}>{type === "success" ? "✅" : "⚠️"}</span>
        <span>{message}</span>
      </div>

      <button onClick={onClose} style={styles.closeButton}>
        ×
      </button>
    </div>
  );
}

const styles = {
  toast: {
    position: "fixed",
    top: "24px",
    right: "24px",
    minWidth: "280px",
    maxWidth: "420px",
    padding: "14px 16px",
    borderRadius: "12px",
    boxShadow: "0 10px 24px rgba(0,0,0,0.15)",
    zIndex: 2000,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "14px",
    fontWeight: "bold",
    animation: "slideInToast 0.25s ease",
  },
  success: {
    backgroundColor: "#dcfce7",
    color: "#166534",
    border: "1px solid #86efac",
  },
  error: {
    backgroundColor: "#fee2e2",
    color: "#991b1b",
    border: "1px solid #fca5a5",
  },
  content: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    lineHeight: "1.4",
  },
  icon: {
    fontSize: "18px",
  },
  closeButton: {
    border: "none",
    background: "transparent",
    cursor: "pointer",
    fontSize: "20px",
    fontWeight: "bold",
    color: "inherit",
  },
};

export default Toast;