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

  return (
    <div className="card">
      <h3>{expenseToEdit ? "Edit expense" : "Add expense"}</h3>
      <p className="section-note">Keep it short. Date, category, amount, and a note if needed.</p>
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="amount">Amount (₹)</label>
          <input 
            type="number" 
            name="amount" 
            id="amount"
            placeholder="Enter amount"
            value={formData.amount} 
            onChange={(e) => setFormData({...formData, amount: e.target.value})} 
            required 
          />
        </div>

        <div className="input-group">
          <label htmlFor="category">Category</label>
          <select 
            name="category" 
            id="category"
            value={formData.category} 
            onChange={(e) => setFormData({...formData, category: e.target.value})}
          >
            <option value="Food">Food and dining</option>
            <option value="Travel">Travel</option>
            <option value="Shopping">Shopping</option>
            <option value="Bills">Bills and subscriptions</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="input-group">
          <label htmlFor="description">Description</label>
          <input 
            type="text" 
            name="description" 
            id="description"
            placeholder="Add a note (optional)"
            value={formData.description} 
            onChange={(e) => setFormData({...formData, description: e.target.value})} 
          />
        </div>

        <div className="input-group">
          <label htmlFor="date">Date</label>
          <input 
            type="date" 
            name="date" 
            id="date"
            value={formData.date} 
            onChange={(e) => setFormData({...formData, date: e.target.value})} 
            required 
          />
        </div>

        <div className="button-row">
          <button type="submit" className="btn-primary" style={{flex: 1}}>
            {expenseToEdit ? "Update" : "Add expense"}
          </button>
          {expenseToEdit && (
            <button 
              type="button" 
              className="btn-secondary" 
              onClick={() => { 
                setExpenseToEdit(null); 
                setFormData({ amount: "", category: "Food", description: "", date: new Date().toISOString().split("T")[0] })
              }}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default ExpenseForm;