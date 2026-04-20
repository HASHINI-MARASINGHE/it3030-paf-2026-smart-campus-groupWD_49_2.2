import { useEffect, useState } from "react";

function FacilityForm({ initialData, onSubmit, buttonText = "Save Facility" }) {
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    type: "",
    capacity: "",
    status: "",
    available: true,
  });

  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setFormData({
      name: initialData?.name || "",
      location: initialData?.location || "",
      type: initialData?.type || "",
      capacity: initialData?.capacity ?? "",
      status: initialData?.status || "",
      available: initialData?.available ?? true,
    });
    setErrors({});
  }, [initialData]);

  const validateField = (name, value) => {
    switch (name) {
      case "name":
        if (!String(value).trim()) return "Facility name is required";
        return "";

      case "location":
        if (!String(value).trim()) return "Location is required";
        return "";

      case "type":
        if (!String(value).trim()) return "Type is required";
        return "";

      case "capacity":
        if (value === "" || value === null || value === undefined) {
          return "Capacity is required";
        }
        if (Number(value) < 1) {
          return "Capacity must be at least 1";
        }
        return "";

      case "status":
        if (!String(value).trim()) return "Status is required";
        return "";

      default:
        return "";
    }
  };

  const validateForm = () => {
    const newErrors = {
      name: validateField("name", formData.name),
      location: validateField("location", formData.location),
      type: validateField("type", formData.type),
      capacity: validateField("capacity", formData.capacity),
      status: validateField("status", formData.status),
    };

    Object.keys(newErrors).forEach((key) => {
      if (!newErrors[key]) {
        delete newErrors[key];
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    const updatedValue =
      type === "checkbox" ? checked : name === "capacity" ? value : value;

    setFormData((prev) => ({
      ...prev,
      [name]: updatedValue,
    }));

    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, updatedValue),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const isValid = validateForm();
    if (!isValid) return;

    const payload = {
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
      type: formData.type.trim(),
      capacity: Number(formData.capacity),
      status: formData.status.trim(),
      available: Boolean(formData.available),
    };

    try {
      setSubmitting(true);
      await onSubmit(payload);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={styles.form} noValidate>
      <div style={styles.formGroup}>
        <label style={styles.label}>Facility Name</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter facility name"
          style={{
            ...styles.input,
            ...(errors.name ? styles.inputError : {}),
          }}
        />
        {errors.name && <p style={styles.errorText}>{errors.name}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          placeholder="Enter location"
          style={{
            ...styles.input,
            ...(errors.location ? styles.inputError : {}),
          }}
        />
        {errors.location && <p style={styles.errorText}>{errors.location}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Type</label>
        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.type ? styles.inputError : {}),
          }}
        >
          <option value="">Select type</option>
          <option value="Lecture Hall">Lecture Hall</option>
          <option value="Lab">Lab</option>
          <option value="Meeting Room">Meeting Room</option>
          <option value="Equipment">Equipment</option>
        </select>
        {errors.type && <p style={styles.errorText}>{errors.type}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Capacity</label>
        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          placeholder="Enter capacity"
          style={{
            ...styles.input,
            ...(errors.capacity ? styles.inputError : {}),
          }}
          min="1"
        />
        {errors.capacity && <p style={styles.errorText}>{errors.capacity}</p>}
      </div>

      <div style={styles.formGroup}>
        <label style={styles.label}>Status</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          style={{
            ...styles.input,
            ...(errors.status ? styles.inputError : {}),
          }}
        >
          <option value="">Select status</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT_OF_SERVICE</option>
        </select>
        {errors.status && <p style={styles.errorText}>{errors.status}</p>}
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

      <button type="submit" style={styles.submitButton} disabled={submitting}>
        {submitting ? "Saving..." : buttonText}
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
    boxSizing: "border-box",
  },
  inputError: {
    border: "1px solid #dc2626",
    backgroundColor: "#fef2f2",
  },
  errorText: {
    marginTop: "6px",
    marginBottom: "0",
    color: "#dc2626",
    fontSize: "13px",
    fontWeight: "600",
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
    opacity: 1,
  },
};

export default FacilityForm;