import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import API from "../api/api";

ChartJS.register(ArcElement, Tooltip, Legend);

const ExpenseChart = ({ updateTrigger, totalExpense }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchCategoryData = async () => {
      try {
        const { data } = await API.get("/expenses/category");
        
        if (data.length === 0) {
          setChartData(null);
          return;
        }

        // Premium gradient-ready colors without blue
        const colors = [
          "#10B981", // Emerald Green
          "#8B5CF6", // Purple
          "#F59E0B", // Amber
          "#EF4444", // Red
          "#EC4899", // Pink
          "#06B6D4", // Cyan
          "#F97316", // Orange
          "#6366F1", // Indigo (non-blue)
        ];

        const formattedData = {
          labels: data.map((item) => item._id),
          datasets: [{
            data: data.map((item) => item.total),
            backgroundColor: colors.slice(0, data.length),
            borderWidth: 0,
            hoverOffset: 8,
          }],
        };
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching chart", error);
      }
    };
    fetchCategoryData();
  }, [updateTrigger]);

  const options = {
    layout: {
      padding: 10
    },
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          usePointStyle: true, 
          padding: 16,
          font: { family: "'Inter', sans-serif", size: 12, weight: '600' },
          color: '#6B7280'
        } 
      },
      tooltip: {
        backgroundColor: 'rgba(31, 41, 55, 0.9)',
        padding: 12,
        titleFont: { size: 13, family: "'Inter', sans-serif", weight: '700' },
        bodyFont: { size: 12, family: "'Inter', sans-serif" },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1
      }
    },
    cutout: '72%',
    maintainAspectRatio: false
  };

  return (
    <div className="card chart-container">
      <h3>📊 Spending by Category</h3>
      
      <div className="chart-wrapper">
        {chartData ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="chart-center-text">
              <span>Total Spent</span>
              <h4>₹{totalExpense ? totalExpense.toLocaleString() : 0}</h4>
            </div>
          </>
        ) : (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "100px", fontSize: "0.95rem" }}>
            💡 Add expenses to see analysis
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;