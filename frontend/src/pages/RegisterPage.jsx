import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fullName: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      await register(
        formData.username,
        formData.email,
        formData.password,
        formData.fullName
      );
      navigate('/');
    } catch (err) {
      setError(err.error || err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.leftPanel}>
        <div style={styles.leftContent}>
          <h1 style={styles.brand}>SLIIT Smart Campus</h1>
          <p style={styles.text}>
            Create an account to access facilities, book resources, and manage your campus activities.
          </p>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.formTitle}>Register</h2>

          {error && <div style={styles.errorMessage}>{error}</div>}

          <label style={styles.label}>Full Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />

          <label style={styles.label}>Username</label>
          <input
            type="text"
            name="username"
            placeholder="Choose a username"
            value={formData.username}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />

          <label style={styles.label}>Email</label>
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter password (min 6 characters)"
            value={formData.password}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />

          <label style={styles.label}>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
            style={styles.input}
            required
            disabled={loading}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Creating Account...' : 'Register'}
          </button>

          <p style={styles.footer}>
            Already have an account? <Link to="/login" style={styles.link}>Login here</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

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
    overflowY: "auto",
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
  errorMessage: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    padding: "12px",
    borderRadius: "8px",
    marginBottom: "15px",
  },
  footer: {
    textAlign: "center",
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "#f4b400",
    textDecoration: "none",
    fontWeight: "bold",
  },
};

export default RegisterPage;
