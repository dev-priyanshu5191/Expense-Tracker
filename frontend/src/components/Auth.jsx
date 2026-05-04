import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/api.js";

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: "", email: "", password: "" });
  const [errorMsg, setErrorMsg] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const { data } = await API.post(endpoint, formData);
      
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.name);
      localStorage.setItem("userRole", data.role);
      
      navigate("/dashboard"); 
    } catch (error) {
      setErrorMsg(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="app-container" style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
      <div className="card animate-slide-up" style={{ width: "100%", maxWidth: "420px" }}>
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <h2 style={{ 
            fontSize: "2rem", 
            fontWeight: "800", 
            background: "linear-gradient(135deg, #10B981 0%, #8B5CF6 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            marginBottom: "8px"
          }}>
            💰 Smart Finance
          </h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", fontWeight: "500" }}>
            {isLogin ? "Welcome back to your financial hub" : "Start managing your finances"}
          </p>
        </div>
        
        {errorMsg && (
          <div style={{ 
            background: "linear-gradient(135deg, #FEE2E2, #FECACA)", 
            color: "#DC2626", 
            padding: "14px 16px", 
            borderRadius: "12px", 
            marginBottom: "20px", 
            textAlign: "center", 
            fontSize: "0.9rem",
            fontWeight: "600",
            border: "1px solid rgba(220, 38, 38, 0.2)"
          }}>
            ⚠️ {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label>👤 Full Name</label>
              <input 
                type="text" 
                name="name" 
                placeholder="John Doe"
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <div className="input-group">
            <label>📧 Email</label>
            <input 
              type="email" 
              name="email" 
              placeholder="you@example.com"
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label>🔐 Password</label>
            <input 
              type="password" 
              name="password" 
              placeholder="••••••••"
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: "24px", width: "100%" }}>
            {isLogin ? "🚀 Login" : "✨ Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "24px", paddingTop: "24px", borderTop: "1px solid var(--border-light)" }}>
          <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "0" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <span 
              style={{ 
                color: "var(--primary-color)", 
                cursor: "pointer", 
                fontWeight: "700",
                transition: "all 0.2s ease",
                padding: "0 4px"
              }} 
              onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
              onMouseEnter={(e) => e.target.style.opacity = "0.8"}
              onMouseLeave={(e) => e.target.style.opacity = "1"}
            >
              {isLogin ? "Sign up here" : "Login here"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;