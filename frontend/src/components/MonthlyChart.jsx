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
              label: "Amount spent (₹)",
              data: data.map((item) => item.total),
              backgroundColor: "rgba(101, 122, 102, 0.8)",
              borderRadius: 8,
              borderSkipped: false,
              barThickness: 26,
              categoryPercentage: 0.76,
              borderColor: 'rgba(101, 122, 102, 0.9)',
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
        backgroundColor: "rgba(31, 31, 28, 0.95)",
        padding: 14,
        titleFont: { size: 14, family: "system-ui, sans-serif", weight: '700' },
        bodyFont: { size: 13, family: "system-ui, sans-serif", weight: '600' },
        borderColor: 'rgba(255, 255, 255, 0.12)',
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
          color: "#e7e1d6",
          drawBorder: false,
          lineWidth: 0.5
        },
        border: { display: false },
        ticks: {
          font: { size: 12, family: "system-ui, sans-serif", weight: '500' },
          color: '#61615b',
          callback: (value) => '₹' + value.toLocaleString()
        }
      },
      x: {
        grid: { display: false },
        border: { display: false },
        ticks: {
          font: { size: 12, family: "system-ui, sans-serif", weight: '600' },
          color: '#61615b'
        }
      }
    }
  };

  return (
    <div className="card animate-slide-up" style={{ marginBottom: "30px" }}>
      <h3>Monthly spending trend</h3>
      <div style={{ height: "320px", width: "100%" }}>
        {chartData ? (
          <Bar data={chartData} options={options} />
        ) : (
          <p className="empty-state">
            Track spending across months.
          </p>
        )}
      </div>
    </div>
  );
};

export default MonthlyChart;