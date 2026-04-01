import { useState } from "react";

function FacilityForm({ initialData, onSubmit, buttonText = "Save Facility" }) {
  const [formData, setFormData] = useState({
    name: initialData?.name || "",
    location: initialData?.location || "",
    type: initialData?.type || "",
    capacity: initialData?.capacity || "",
    status: initialData?.status || "",
    available: initialData?.available ?? true,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : name === "capacity" ? Number(value) : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;
    if (!formData.location.trim()) return;
    if (!formData.type.trim()) return;
    if (!formData.status.trim()) return;
    if (!formData.capacity || formData.capacity < 1) return;

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form}>
      <div style={styles.formGroup}>
        <label style={styles.label}>Facility Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter facility name"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
          style={styles.input}
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select type</option>
          <option value="Lecture Hall">Lecture Hall</option>
          <option value="Lab">Lab</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Equipment">Equipment</option>
        </select>
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Enter capacity"
          style={styles.input}
          min="1"
          required
        />
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={styles.input}
          required
        >
          <option value="">Select status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
      </div>

      <div style={styles.checkboxWrapper}>
        <label style={styles.checkboxBox}>
          <input
            type="checkbox"
            name="available"
            checked={formData.available}
            onChange={handleChange}
          />
          <span style={styles.checkboxLabel}>Available</span>
        </label>
      </div>

      <button type="submit" style={styles.submitButton}>
        {buttonText}
      </button>
    </form>
  );
}

const styles = {
  form: {
    backgroundColor: "#fff",
    padding: "28px",
    borderRadius: "14px",
    boxShadow: "0 3px 12px rgba(0,0,0,0.08)",
    maxWidth: "800px",
    borderLeft: "5px solid #f4b400",
  },
  formGroup: {
    marginBottom: "18px",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    fontWeight: "bold",
    color: "#1f2f6b",
    fontSize: "16px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    outline: "none",
    fontSize: "15px",
  },
  checkboxWrapper: {
    marginBottom: "20px",
  },
  checkboxBox: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    fontWeight: "bold",
    color: "#333",
  },
  checkboxLabel: {
    fontSize: "16px",
  },
  submitButton: {
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    padding: "12px 18px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default FacilityForm;