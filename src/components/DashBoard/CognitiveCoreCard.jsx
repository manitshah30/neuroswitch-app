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

function CognitiveCoreCard() {
  // Mock data for the radar chart
  const data = {
    labels: ['Focus', 'Memory', 'Logic', 'Creativity', 'Adaptability'],
    datasets: [
      {
        label: 'Your Score',
        data: [80, 75, 90, 65, 85], // Example scores
        backgroundColor: 'rgba(139, 92, 246, 0.4)', // Purple with transparency
        borderColor: 'rgba(139, 92, 246, 0.8)', // Solid purple border
        pointBackgroundColor: 'rgba(139, 92, 246, 1)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgba(139, 92, 246, 1)',
        borderWidth: 2,
        fill: true,
      },
      // You could add another dataset for a benchmark/average here
      // {
      //   label: 'Average User',
      //   data: [70, 70, 70, 70, 70],
      //   backgroundColor: 'rgba(255, 255, 255, 0.1)',
      //   borderColor: 'rgba(255, 255, 255, 0.3)',
      //   pointBackgroundColor: 'rgba(255, 255, 255, 0.5)',
      //   pointBorderColor: '#fff',
      //   pointHoverBackgroundColor: '#fff',
      //   pointHoverBorderColor: 'rgba(255, 255, 255, 0.5)',
      //   borderWidth: 1,
      //   fill: true,
      // }
    ],
  };

  // Options for the radar chart to customize its appearance
  const options = {
    responsive: true,
    maintainAspectRatio: false, // Allows the chart to fill its container
    scales: {
      r: {
        angleLines: {
          color: 'rgba(255, 255, 255, 0.2)', // Lines radiating from the center
        },
        grid: {
          color: 'rgba(255, 255, 255, 0.2)', // Circular grid lines
        },
        pointLabels: {
          color: '#ffffff', // Labels for each point (Focus, Memory, etc.)
          font: {
            size: 14,
          }
        },
        ticks: {
          display: false, // Hide the numbers on the scale
          beginAtZero: true,
          max: 100, // Max value for the scale
        },
        min: 0,
        max: 100,
      },
    },
    plugins: {
      legend: {
        display: false, // Hide the legend for simplicity, as there's only one dataset
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            let label = context.dataset.label || '';
            if (label) {
              label += ': ';
            }
            if (context.parsed.r !== null) {
              label += context.parsed.r + '%'; // Display score as percentage
            }
            return label;
          }
        }
      }
    },
  };

  return (
    // Card with "glassmorphism" effect matching your other cards
    <div className="bg-slate-800/40 backdrop-blur-md border border-slate-700 p-8 rounded-2xl shadow-2xl shadow-blue-500/10 flex flex-col h-full items-center justify-center">
      <h2 className="text-3xl font-bold text-white mb-6">Skill Analysis</h2>
      
      {/* Chart container */}
      <div className="w-full max-w-lg h-80"> {/* Set a specific height for the chart */}
        <Radar data={data} options={options} />
      </div>

      {/* The glowing blur from your image, for aesthetics */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-48 h-48 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl opacity-30 animate-pulse"></div>
      </div>
    </div>
  );
}

export default CognitiveCoreCard;