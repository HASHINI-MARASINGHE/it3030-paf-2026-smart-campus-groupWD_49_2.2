import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FacilityForm from "../../components/admin/FacilityForm";
import Toast from "../../components/common/Toast";
import { addFacility } from "../../api/facilityApi";

function AddFacilityPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");

  const getErrorMessage = (error) => {
    if (error.response?.data?.messages) {
      const validationMessages = Object.values(error.response.data.messages);
      return validationMessages.join(" | ");
    }

    if (error.response?.data?.message) {
      return error.response.data.message;
    }

    if (error.code === "ERR_NETWORK") {
      return "Cannot connect to server. Please make sure backend is running.";
    }

    return "Failed to add facility";
  };

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
      setMessage(getErrorMessage(error));
      setMessageType("error");
    }
  };

  return (
    <div style={styles.page}>
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
        <p style={styles.subText}>
          Create a new campus facility or resource.
        </p>
      </div>

      <div style={styles.formWrapper}>
        <div style={styles.formContainer}>
          <FacilityForm
            onSubmit={handleAddFacility}
            buttonText="Add Facility"
          />
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    padding: "20px 30px",
  },

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
    fontWeight: "700",
  },

  subText: {
    color: "#555",
    fontSize: "16px",
  },

  formWrapper: {
    marginTop: "25px",
    display: "flex",
    justifyContent: "center",
  },

  formContainer: {
    width: "100%",
    maxWidth: "700px",
    background: "#ffffff",
    padding: "30px",
    borderRadius: "12px",
    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
  },
};

export default AddFacilityPage;