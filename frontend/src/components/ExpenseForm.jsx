import React, { useState, useEffect } from "react";
import API from "../api/api";

const ExpenseForm = ({ fetchExpenses, expenseToEdit, setExpenseToEdit }) => {
  const [formData, setFormData] = useState({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] });

  useEffect(() => {
    if (expenseToEdit) {
      setFormData({
        amount: expenseToEdit.amount,
        category: expenseToEdit.category,
        description: expenseToEdit.description,
        date: expenseToEdit.date.split("T")[0]
      });
    }
  }, [expenseToEdit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (expenseToEdit) {
        await API.put(`/expenses/${expenseToEdit._id}`, formData);
        setExpenseToEdit(null);
      } else {
        await API.post("/expenses", formData);
      }
      setFormData({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] });
      fetchExpenses();
    } catch (error) {
      console.error(error);
    }
  };

  const categoryIcons = {
    Food: "🍔",
    Travel: "✈️",
    Shopping: "🛍️",
    Bills: "📄",
    Other: "📦"
  };

  return (
    <div className="card">
      <h3>{expenseToEdit ? "✏️ Edit Expense" : "➕ Add New Expense"}</h3>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label>💰 Amount (₹)</label>
          <input 
            type="number" 
            name="amount" 
            placeholder="Enter amount"
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
            required 
          />
        </div>

        <div className="input-group">
          <label>📂 Category</label>
          <select 
            name="category" 
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food">🍔 Food & Dining</option>
            <option value="Travel">✈️ Travel</option>
            <option value="Shopping">🛍️ Shopping</option>
            <option value="Bills">📄 Bills & Subscriptions</option>
            <option value="Other">📦 Other</option>
          </select>
        </div>

        <div className="input-group">
          <label>📝 Description</label>
          <input 
            type="text" 
            name="description" 
            placeholder="Add a note (optional)"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="input-group">
          <label>📅 Date</label>
          <input 
            type="date" 
            name="date" 
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
            required 
          />
        </div>

        <div style={{display: 'flex', gap: '12px', marginTop: '8px'}}>
          <button type="submit" className="btn-primary" style={{flex: 1}}>
            {expenseToEdit ? "💾 Update" : "➕ Add Expense"}
          </button>
          {expenseToEdit && (
            <button 
              type="button" 
              className="btn-logout" 
              onClick={() => { 
                setExpenseToEdit(null); 
                setFormData({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] })
              }}
            >
              ✕ Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;