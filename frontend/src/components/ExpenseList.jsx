import React from "react";
import API from "../api/api";

const ExpenseList = ({ expenses, fetchExpenses, setExpenseToEdit, isAdminView }) => {
  const handleDelete = async (id) => {
    if(window.confirm("🗑️ Delete this expense permanently?")) {
      await API.delete(`/expenses/${id}`);
      fetchExpenses();
    }
  };

  const categoryIcons = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛍️",
    Bills: "📄",
    Other: "📦"
  };

  const getCategoryBadgeClass = (category) => {
    return `category-badge badge-${category.toLowerCase()}`;
  };

  return (
    <div className="card animate-slide-up" style={{ marginTop: isAdminView ? '0' : '20px' }}>
      <h3>{isAdminView ? "📂 All Users Database" : "📜 My Transactions"}</h3>
      <div style={{ overflowX: "auto" }}>
        <table>
          <thead>
            <tr>
              <th>📅 Date</th>
              {isAdminView && <th>👤 User</th>}
              <th>📂 Category</th>
              <th>📝 Details</th>
              <th>💰 Amount</th>
              {!isAdminView && <th>⚙️ Action</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.length > 0 ? (
              expenses.map((exp) => (
                <tr key={exp._id}>
                  <td style={{ color: "#6B7280", fontWeight: "500" }}>
                    {new Date(exp.date).toLocaleDateString('en-IN', { 
                      year: 'numeric', 
                      month: 'short', 
                      day: 'numeric' 
                    })}
                  </td>
                  {isAdminView && (
                    <td style={{fontWeight: "600", color: "var(--primary-color)"}}>{exp.user?.name || "Unknown"}</td>
                  )}
                  <td>
                    <span className={getCategoryBadgeClass(exp.category)}>
                      {categoryIcons[exp.category] || "📦"} {exp.category}
                    </span>
                  </td>
                  <td style={{color: "var(--text-secondary)"}}>{exp.description || "—"}</td>
                  <td style={{ fontWeight: 700, color: "var(--primary-color)", fontSize: "1rem" }}>₹{exp.amount.toLocaleString()}</td>
                  {!isAdminView && (
                    <td>
                      <button 
                        className="edit-btn" 
                        onClick={() => setExpenseToEdit(exp)}
                        title="Edit expense"
                      >
                        ✏️ Edit
                      </button>
                      <button 
                        className="delete-btn" 
                        style={{marginLeft: "8px"}} 
                        onClick={() => handleDelete(exp._id)}
                        title="Delete expense"
                      >
                        🗑️
                      </button>
                    </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={isAdminView ? 5 : 6} style={{ textAlign: "center", padding: "40px 16px", color: "#6B7280" }}>
                  💡 No expenses yet. Start tracking your spending!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ExpenseList;