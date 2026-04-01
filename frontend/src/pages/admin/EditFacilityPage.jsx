import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import FacilityForm from "../../components/admin/FacilityForm";
import Toast from "../../components/common/Toast";
import { getFacilityById, updateFacility } from "../../api/facilityApi";

function EditFacilityPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [facility, setFacility] = useState(null);
  const [loading, setLoading] = useState(true);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  useEffect(() => {
    const fetchFacility = async () => {
      try {
        const response = await getFacilityById(id);
        setFacility(response.data);
      } catch (error) {
        console.error("Error loading facility:", error);
        setMessage("Failed to load facility details");
        setMessageType("error");
      } finally {
        setLoading(false);
      }
    };

    fetchFacility();
  }, [id]);

  const handleUpdateFacility = async (facilityData) => {
    try {
      await updateFacility(id, facilityData);
      setMessage("Facility updated successfully");
      setMessageType("success");

      setTimeout(() => {
        navigate("/admin/facilities");
      }, 1200);
    } catch (error) {
      console.error("Error updating facility:", error);
      setMessage("Failed to update facility");
      setMessageType("error");
    }
  };

  if (loading) {
    return (
      <div style={styles.loaderWrapper}>
        <div style={styles.spinner}></div>
        <p style={styles.loadingText}>Loading facility details...</p>
      </div>
    );
  }

  if (!facility) {
    return (
      <div>
        <Toast
          message={message}
          type={messageType}
          onClose={() => {
            setMessage("");
            setMessageType("");
          }}
        />

        <Link to="/admin/facilities" style={styles.backLink}>
          ← Back to Facilities
        </Link>

        <div style={styles.emptyBox}>
          <div style={styles.emptyIcon}>⚠️</div>
          <h3 style={styles.emptyTitle}>Facility not found</h3>
          <p style={styles.emptyText}>The selected facility could not be loaded.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Toast
        message={message}
        type={messageType}
        onClose={() => {
          setMessage("");
          setMessageType("");
        }}
      />

      <Link to="/admin/facilities" style={styles.backLink}>
        ← Back to Facilities
      </Link>

      <div style={styles.headerBox}>
        <h2 style={styles.heading}>Edit Facility</h2>
        <p style={styles.subText}>Update facility details.</p>
      </div>

      <div style={styles.formWrapper}>
        <FacilityForm
          initialData={facility}
          onSubmit={handleUpdateFacility}
          buttonText="Update Facility"
        />
      </div>
    </div>
  );
}

const styles = {
  backLink: {
    display: "inline-block",
    marginBottom: "16px",
    color: "#1f2f6b",
    fontWeight: "bold",
    textDecoration: "none",
  },
  headerBox: {
    marginBottom: "10px",
  },
  heading: {
    color: "#1f2f6b",
    marginBottom: "6px",
    fontSize: "30px",
  },
  subText: {
    color: "#555",
    fontSize: "16px",
  },
  formWrapper: {
    marginTop: "20px",
  },
  loaderWrapper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    padding: "50px 20px",
    borderRadius: "14px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  spinner: {
    width: "42px",
    height: "42px",
    border: "5px solid #e5e7eb",
    borderTop: "5px solid #1f2f6b",
    borderRadius: "50%",
    animation: "spin 1s linear infinite",
  },
  loadingText: {
    marginTop: "14px",
    color: "#37424a",
    fontWeight: "bold",
  },
  emptyBox: {
    backgroundColor: "#fff",
    padding: "40px 30px",
    borderRadius: "14px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
  },
  emptyIcon: {
    fontSize: "42px",
    marginBottom: "10px",
  },
  emptyTitle: {
    color: "#1f2f6b",
    marginBottom: "8px",
  },
  emptyText: {
    color: "#555",
  },
};

export default EditFacilityPage;