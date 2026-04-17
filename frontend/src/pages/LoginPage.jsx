import { useMemo, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { login, googleLogin } = useAuth();

  const googleClientEnabled = Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID);
  const redirectPath = useMemo(() => location.state?.from?.pathname || "/facilities", [location.state]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email.trim(), password);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setError("");
    setLoading(true);

    try {
      if (!credentialResponse?.credential) {
        throw new Error("Google credential is missing");
      }

      await googleLogin(credentialResponse.credential);
      navigate(redirectPath, { replace: true });
    } catch (err) {
      setError(err.message || "Google login failed");
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
            Sign in to book campus facilities and continue your work safely.
          </p>
          <Link to="/" style={styles.backLink}>
            ← Back to Home
          </Link>
        </div>
      </div>

      <div style={styles.rightPanel}>
        <form style={styles.form} onSubmit={handleSubmit}>
          <h2 style={styles.formTitle}>Login</h2>

          {error ? <div style={styles.errorMessage}>{error}</div> : null}

          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />

          <label style={styles.label}>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            style={styles.input}
            required
            disabled={loading}
          />

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>

          {googleClientEnabled ? (
            <>
              <div style={styles.divider}>OR</div>
              <div style={styles.googleLogin}>
                <GoogleLogin onSuccess={handleGoogleSuccess} onError={() => setError("Google login failed")} />
              </div>
            </>
          ) : (
            <p style={styles.helperText}>Google login will appear after you set VITE_GOOGLE_CLIENT_ID.</p>
          )}

          <p style={styles.footer}>
            Don&apos;t have an account?{" "}
            <Link to="/register" style={styles.link}>
              Register here
            </Link>
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
  divider: {
    textAlign: "center",
    margin: "20px 0",
    color: "#999",
  },
  googleLogin: {
    display: "flex",
    justifyContent: "center",
    marginTop: "15px",
  },
  helperText: {
    marginTop: "16px",
    fontSize: "14px",
    color: "#6b7280",
    textAlign: "center",
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

export default LoginPage;