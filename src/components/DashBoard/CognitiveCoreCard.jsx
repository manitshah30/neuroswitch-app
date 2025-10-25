import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// NEW: The component now accepts `averageScores` as a prop
function CognitiveCoreCard({ averageScores }) {
  
  // Use the passed-in scores to build the chart data dynamically
  const data = {
    // NEW: Labels now match the actual skills you are measuring
    labels: ['Attention', 'Memory', 'Speed'],
    datasets: [
      {
        label: 'Your Score',
        // NEW: Data is now pulled from the `averageScores` prop
        data: [
          averageScores.attention,
          averageScores.memory,
          averageScores.speed
        ],
        backgroundColor: 'rgba(139, 92, 246, 0.4)',
        borderColor: 'rgba(139, 92, 246, 0.8)',
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)',
        },
        pointLabels: {
          color: '#ffffff',
          font: {
            size: 14,
          }
        },
        ticks: {
          display: false,
          beginAtZero: true,
          max: 100,
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r + '%';
            }
            return label;
          }
        }
      }
    },
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col h-full items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-6">Skill Analysis</h2>
      
      <div className="w-full max-w-lg h-80">
        <Radar data={data} options={options} />
      </div>

      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
}

export default CognitiveCoreCard;
