import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";

function LoginPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate("/admin");
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <h1 style={styles.brand}>SLIIT Smart Campus</h1>
          <p style={styles.text}>
            Sign in with your university username and password to continue.
          </p>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.formTitle}>Login</h2>

          <label style={styles.label}>University Username</label>
          <input
            type="text"
            name="username"
            placeholder="Enter username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
          />

          <button type="submit" style={styles.button}>
            Login
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
  },
  leftPanel: {
    background: "linear-gradient(135deg, #1f2f6b, #37424a)",
    color: "#fff",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "60px",
  },
  leftContent: {
    maxWidth: "520px",
  },
  brand: {
    fontSize: "40px",
    marginBottom: "20px",
  },
  text: {
    fontSize: "18px",
    lineHeight: "1.7",
    maxWidth: "500px",
    marginBottom: "22px",
  },
  backLink: {
    color: "#f4b400",
    textDecoration: "none",
    fontWeight: "bold",
  },
  rightPanel: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f6f8",
    padding: "20px",
  },
  form: {
    backgroundColor: "#fff",
    padding: "35px",
    borderRadius: "12px",
    boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
    width: "100%",
    maxWidth: "420px",
  },
  formTitle: {
    marginBottom: "20px",
    color: "#1f2f6b",
  },
  label: {
    display: "block",
    marginBottom: "8px",
    marginTop: "12px",
    fontWeight: "bold",
  },
  input: {
    width: "100%",
    padding: "12px",
    border: "1px solid #d9d9d9",
    borderRadius: "8px",
    marginBottom: "10px",
    boxSizing: "border-box",
  },
  button: {
    width: "100%",
    marginTop: "15px",
    padding: "12px",
    backgroundColor: "#f4b400",
    color: "#1f2f6b",
    border: "none",
    borderRadius: "8px",
    fontWeight: "bold",
    cursor: "pointer",
  },
};

export default LoginPage;