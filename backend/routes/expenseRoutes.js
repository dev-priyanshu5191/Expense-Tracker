const express = require("express");
const router = express.Router();

// YAHAN DHYAN DEIN: getMonthlyData ko import karna zaroori hai
const { 
  addExpense, 
  getExpenses, 
  updateExpense, 
  deleteExpense, 
  getCategoryData,
  getMonthlyData, 
  getAllUsersExpenses 
} = require("../controllers/expenseController");

const { protect, admin } = require("../middleware/authMiddleware");

// Normal User Routes
router.post("/", protect, addExpense);
router.get("/", protect, getExpenses);
router.get("/category", protect, getCategoryData);
router.get("/monthly", protect, getMonthlyData); // Ye route chalne lagega ab
router.put("/:id", protect, updateExpense);
router.delete("/:id", protect, deleteExpense);

// Admin Route
router.get("/admin/all", protect, admin, getAllUsersExpenses);

module.exports = router;