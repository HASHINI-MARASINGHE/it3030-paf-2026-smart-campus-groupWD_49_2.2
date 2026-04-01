import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FacilityForm from "../../components/admin/FacilityForm";
import Toast from "../../components/common/Toast";
import { addFacility } from "../../api/facilityApi";

function AddFacilityPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const handleAddFacility = async (facilityData) => {
    try {
      await addFacility(facilityData);
      setMessage("Facility added successfully");
      setMessageType("success");

      setTimeout(() => {
        navigate("/admin/facilities");
      }, 1200);
    } catch (error) {
      console.error("Error adding facility:", error);
      setMessage("Failed to add facility");
      setMessageType("error");
    }
  };

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
        <h2 style={styles.heading}>Add New Facility</h2>
        <p style={styles.subText}>Create a new campus facility or resource.</p>
      </div>

      <div style={styles.formWrapper}>
        <FacilityForm onSubmit={handleAddFacility} buttonText="Add Facility" />
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
};

export default AddFacilityPage;