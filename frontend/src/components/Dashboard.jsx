import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ExpenseForm from "./ExpenseForm";
import ExpenseList from "./ExpenseList";
import ExpenseChart from "./ExpenseChart";
import MonthlyChart from "./MonthlyChart"; // Naya Monthly Chart yahan import hua
import API from "../api/api";

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [allUsersExpenses, setAllUsersExpenses] = useState([]);
  const [updateTrigger, setUpdateTrigger] = useState(false);
  const [expenseToEdit, setExpenseToEdit] = useState(null); 
  
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "User";
  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    fetchExpenses();
    if (userRole === "admin") fetchAllUsersExpenses();
  }, [updateTrigger]);

  const fetchExpenses = async () => {
    try {
      const { data } = await API.get("/expenses");
      setExpenses(data);
    } catch (err) {
      if(err.response?.status === 401) handleLogout();
    }
  };

  const fetchAllUsersExpenses = async () => {
    try {
      const { data } = await API.get("/expenses/admin/all");
      setAllUsersExpenses(data);
    } catch (err) {
      console.log("Admin fetch error", err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  // KPI Calculations
  const totalExpense = expenses.reduce((acc, curr) => acc + curr.amount, 0);
  const monthlyExpense = expenses
    .filter(exp => new Date(exp.date).getMonth() === new Date().getMonth())
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="app-container dashboard-shell animate-slide-up">
      <div className="dashboard-header">
        <div className="header-copy">
          <p className="eyebrow">Expense Tracker</p>
          <h1 className="dashboard-title">Spend log</h1>
          <p className="dashboard-subtitle">A small dashboard for keeping track of daily spending without much ceremony.</p>
        </div>
        <div className="header-actions">
          <div className="user-profile">
            <div className="avatar">{userName.charAt(0).toUpperCase()}</div>
            <span>{userName}</span>
          </div>
          {userRole === "admin" && <span className="admin-badge">Admin view</span>}
          <button onClick={handleLogout} className="btn-logout">Log out</button>
        </div>
      </div>

      {userRole === "user" ? (
        <>
          <div className="kpi-container">
            <div className="kpi-card">
              <h4>Total spent</h4>
              <h2>₹{totalExpense.toLocaleString()}</h2>
              <div className="kpi-note">All recorded expenses</div>
            </div>
            <div className="kpi-card">
              <h4>This month</h4>
              <h2>₹{monthlyExpense.toLocaleString()}</h2>
              <div className="kpi-note">Current calendar month</div>
            </div>
            <div className="kpi-card">
              <h4>Entries</h4>
              <h2>{expenses.length}</h2>
              <div className="kpi-note">Logged transactions</div>
            </div>
          </div>

          <div className="top-section">
            <ExpenseForm 
              fetchExpenses={() => setUpdateTrigger(!updateTrigger)} 
              expenseToEdit={expenseToEdit} 
              setExpenseToEdit={setExpenseToEdit} 
            />
            <ExpenseChart updateTrigger={updateTrigger} totalExpense={totalExpense} />
          </div>

          <div className="stacked-section">
            <MonthlyChart updateTrigger={updateTrigger} />
          </div>

          <ExpenseList 
            expenses={expenses} 
            fetchExpenses={() => setUpdateTrigger(!updateTrigger)} 
            setExpenseToEdit={setExpenseToEdit} 
            isAdminView={false} 
          />
        </>
      ) : (
        <div className="admin-panel animate-slide-up">
          <div className="card">
            <h3>All transactions</h3>
            <p className="section-note">View every record across the app from one simple table.</p>
            <ExpenseList expenses={allUsersExpenses} isAdminView={true} />
          </div>
        </div>
      )}

    </div>
  );
};

export default Dashboard;