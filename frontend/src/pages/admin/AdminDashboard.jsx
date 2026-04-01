import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllFacilities } from "../../api/facilityApi";

function AdminDashboard() {
  const [stats, setStats] = useState({
    total: 0,
    available: 0,
    unavailable: 0,
    active: 0,
    outOfService: 0,
  });

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await getAllFacilities();
        const facilities = response.data;

        const total = facilities.length;
        const available = facilities.filter((item) => item.available).length;
        const unavailable = facilities.filter((item) => !item.available).length;
        const active = facilities.filter((item) => item.status === "ACTIVE").length;
        const outOfService = facilities.filter((item) => item.status === "OUT_OF_SERVICE").length;

        setStats({
          total,
          available,
          unavailable,
          active,
          outOfService,
        });
      } catch (error) {
        console.error("Error loading dashboard stats:", error);
      }
    };

    loadStats();
  }, []);

  return (
    <div>
      <h2 style={styles.heading}>Admin Dashboard</h2>

      <div style={styles.cardGrid}>
        <div style={styles.card}>
          <h3>Total Facilities</h3>
          <p style={styles.number}>{stats.total}</p>
        </div>

        <div style={styles.card}>
          <h3>Available Resources</h3>
          <p style={styles.number}>{stats.available}</p>
        </div>

        <div style={styles.card}>
          <h3>Unavailable Resources</h3>
          <p style={styles.number}>{stats.unavailable}</p>
        </div>

        <div style={styles.card}>
          <h3>ACTIVE Status</h3>
          <p style={styles.number}>{stats.active}</p>
        </div>

        <div style={styles.card}>
          <h3>OUT_OF_SERVICE</h3>
          <p style={styles.number}>{stats.outOfService}</p>
        </div>
      </div>

      <div style={styles.quickActions}>
        <Link to="/admin/facilities" style={styles.actionBtn}>
          View Facilities
        </Link>
        <Link to="/admin/facilities/add" style={styles.actionBtnGold}>
          Add Facility
        </Link>
      </div>
    </div>
  );
}

const styles = {
  heading: {
    marginBottom: "20px",
    color: "#1f2f6b",
  },
  cardGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "20px",
  },
  card: {
    backgroundColor: "#fff",
    padding: "24px",
    borderRadius: "12px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  number: {
    fontSize: "30px",
    marginTop: "10px",
    color: "#f4b400",
    fontWeight: "bold",
  },
  quickActions: {
    marginTop: "30px",
    display: "flex",
    gap: "15px",
    flexWrap: "wrap",
  },
  actionBtn: {
    backgroundColor: "#1f2f6b",
    color: "#fff",
    padding: "12px 18px",
    borderRadius: "8px",
  },
  actionBtnGold: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    padding: "12px 18px",
    borderRadius: "8px",
    fontWeight: "bold",
  },
};

export default AdminDashboard;