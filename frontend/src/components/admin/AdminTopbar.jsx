function AdminTopbar() {
  return (
    <div style={styles.topbar}>
      <h1 style={styles.topbarTitle}>Facilities Management Admin Panel</h1>

      <div style={styles.adminBadge}>Admin</div>
    </div>
  );
}

const styles = {
  topbar: {
    backgroundColor: "#fff",
    padding: "20px 30px",
    borderBottom: "3px solid #f4b400",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "16px",
    flexWrap: "wrap",
  },
  topbarTitle: {
    color: "#1f2f6b",
    fontSize: "26px",
    margin: 0,
  },
  adminBadge: {
    backgroundColor: "#eef2ff",
    color: "#1f2f6b",
    padding: "10px 16px",
    borderRadius: "999px",
    fontWeight: "bold",
  },
};

export default AdminTopbar;