import { useState } from "react";
import api from "../api/axios";
import "./admin-login.css";


const AdminLogin = ({ onLogin }: { onLogin: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("adminToken", res.data.token);
      onLogin();
    } catch (err: any) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="main-screen">
      <div className="login-card">
        <p className="login-main-heading">Admin Login</p>

        <p className="email-heading">Enter Admin Email :</p>
        <input
          className="admin-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <p className="password-heading">Enter Admin Password :</p>
        <input
          type="password"
          className="admin-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="login-btn" onClick={handleLogin}>
          Login
        </button>

        {error && <p className="login-error">{error}</p>}
      </div>
    </div>
  );
};

export default AdminLogin;