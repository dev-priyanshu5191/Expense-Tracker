import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";
import API from "../api/api";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MonthlyChart = ({ updateTrigger }) => {
  const [chartData, setChartData] = useState(null);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  useEffect(() => {
    const fetchMonthlyData = async () => {
      try {
        const { data } = await API.get("/expenses/monthly");
        
        if (data.length === 0) {
          setChartData(null);
          return;
        }

        const formattedData = {
          labels: data.map((item) => monthNames[item._id - 1]),
          datasets: [
            {
              label: "Amount Spent (₹)",
              data: data.map((item) => item.total),
              // Premium gradient: Emerald to Purple
              backgroundColor: [
                "#10B981",
                "#059669",
                "#8B5CF6",
                "#7C3AED",
                "#F59E0B",
                "#FBBF24",
                "#EC4899",
                "#F43F5E",
                "#06B6D4",
                "#0891B2",
                "#10B981",
                "#059669"
              ],
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 32,
              categoryPercentage: 0.8,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
            },
          ],
        };
        setChartData(formattedData);
      } catch (error) {
        console.error("Error fetching monthly data", error);
      }
    };
    fetchMonthlyData();
  }, [updateTrigger]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      tooltip: {
        backgroundColor: "rgba(31, 41, 55, 0.95)",
        padding: 14,
        titleFont: { size: 14, family: "'Inter', sans-serif", weight: '700' },
        bodyFont: { size: 13, family: "'Inter', sans-serif", weight: '600' },
        borderColor: 'rgba(255, 255, 255, 0.2)',
        borderWidth: 1,
        displayColors: false,
        callbacks: {
          label: (context) => `₹${context.parsed.y.toLocaleString()}`
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: { 
          color: "#F3F4F6",
          drawBorder: false,
          lineWidth: 0.5
        },
        border: { display: false },
        ticks: {
          font: { size: 12, family: "'Inter', sans-serif", weight: '500' },
          color: '#6B7280',
          callback: (value) => '₹' + value.toLocaleString()
        }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { size: 12, family: "'Inter', sans-serif", weight: '600' },
          color: '#6B7280'
        }
      }
    }
  };

  return (
    <div className="card animate-slide-up" style={{ marginBottom: "30px" }}>
      <h3>📈 Monthly Spending Trends</h3>
      <div style={{ height: "320px", width: "100%" }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p style={{ color: "#6B7280", textAlign: "center", marginTop: "120px", fontSize: "0.95rem" }}>
            💡 Track spending across months
          </p>
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;