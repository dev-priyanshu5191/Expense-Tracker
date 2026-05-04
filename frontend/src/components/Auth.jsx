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
    <div className="app-container auth-shell">
      <div className="card auth-card animate-slide-up">
        <div style={{ textAlign: "left", marginBottom: "22px" }}>
          <p className="eyebrow">Expense Tracker</p>
          <h2 className="auth-title">Simple expense tracking</h2>
          <p className="auth-subtitle" style={{ marginTop: "8px" }}>
            {isLogin ? "Sign in to review your spending and update entries." : "Create a small account and start logging expenses."}
          </p>
        </div>

        {errorMsg && (
          <div style={{
            background: "rgba(141, 79, 69, 0.08)",
            color: "#7f4038",
            padding: "12px 14px",
            borderRadius: "10px",
            marginBottom: "16px",
            fontSize: "0.92rem",
            border: "1px solid rgba(141, 79, 69, 0.18)"
          }}>
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="input-group">
              <label htmlFor="name">Full name</label>
              <input 
                type="text" 
                name="name" 
                id="name"
                placeholder="John Doe"
                onChange={handleChange} 
                required 
              />
            </div>
          )}
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              type="email" 
              name="email" 
                id="email"
              placeholder="you@example.com"
              onChange={handleChange} 
              required 
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              type="password" 
              name="password" 
                id="password"
              placeholder="••••••••"
              onChange={handleChange} 
              required 
            />
          </div>
          <button type="submit" className="btn-primary" style={{ marginTop: "10px", width: "100%" }}>
            {isLogin ? "Sign in" : "Create account"}
          </button>
        </form>

        <div className="auth-meta">
          <span>{isLogin ? "New here?" : "Already have an account?"}</span>
          <button
            type="button"
            className="auth-toggle"
            onClick={() => { setIsLogin(!isLogin); setErrorMsg(""); }}
          >
            {isLogin ? "Create one" : "Go to sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;