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

        const colors = [
          "#657a66",
          "#8a7a62",
          "#787d87",
          "#a08d70",
          "#6f7c74",
          "#93856f",
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
    plugins: {
      legend: { 
        position: 'bottom', 
        labels: { 
          usePointStyle: true, 
          padding: 16,
          font: { family: "system-ui, sans-serif", size: 12, weight: '600' },
          color: '#61615b'
        } 
      },
      tooltip: {
        backgroundColor: 'rgba(31, 31, 28, 0.94)',
        padding: 12,
        titleFont: { size: 13, family: "system-ui, sans-serif", weight: '700' },
        bodyFont: { size: 12, family: "system-ui, sans-serif" },
        borderColor: 'rgba(255, 255, 255, 0.12)',
        borderWidth: 1
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  return (
    <div className="card chart-container">
      <h3>Spending by category</h3>
      
      <div className="chart-wrapper">
        {chartData ? (
          <>
            <Doughnut data={chartData} options={options} />
            <div className="chart-center-text">
              <span>Total spent</span>
              <h4>₹{totalExpense ? totalExpense.toLocaleString() : 0}</h4>
            </div>
          </>
        ) : (
          <p className="empty-state">
            Add expenses to see the category breakdown.
          </p>
        )}
      </div>
    </div>
  );
};

export default ExpenseChart;