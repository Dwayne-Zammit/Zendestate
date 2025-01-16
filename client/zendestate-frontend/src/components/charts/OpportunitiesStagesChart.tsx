import React, { useState, memo } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { ChartEvent, LegendItem } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface Dataset {
  label: string;
  data: number[];
  backgroundColor: string;
  borderColor?: string;
  borderWidth?: number;
  stack?: string;
}

interface ChartData {
  labels: string[];
  datasets: Dataset[];
}

interface ChartComponentProps {
  chartData: ChartData;
  containerStyle?: React.CSSProperties;
}

const OpportunitiesStagesChart: React.FC<ChartComponentProps> = memo(({ chartData, containerStyle }) => {
  const [activeDatasets, setActiveDatasets] = useState<string[]>([]);

  const handleLegendClick = (
    e: ChartEvent,
    legendItem: LegendItem,
    legend: any
  ) => {
    const datasetIndex = legendItem.datasetIndex!;
    const datasetLabel = chartData.datasets[datasetIndex].label;

    const nativeEvent = e.native as MouseEvent; // Get native mouse event for Ctrl/Meta key detection

    if (nativeEvent.ctrlKey || nativeEvent.metaKey) {
      // Ctrl or Cmd is held: allow multiple selection
      setActiveDatasets((prev) =>
        prev.includes(datasetLabel)
          ? prev.filter((label) => label !== datasetLabel) // Deselect if already selected
          : [...prev, datasetLabel] // Add to selection if not already selected
      );
    } else {
      // No modifier key: select only the clicked dataset
      setActiveDatasets((prev) =>
        prev.length === 1 && prev[0] === datasetLabel ? [] : [datasetLabel]
      );
    }
  };

  const filteredChartData = {
    ...chartData,
    datasets: chartData.datasets.map((dataset) => ({
      ...dataset,
      hidden:
        activeDatasets.length > 0 && !activeDatasets.includes(dataset.label),
    })),
  };

  return (
    <div
      style={{
        width: '60%',
        height: '50%',
        margin: '20px auto',
        backgroundColor: '#242424',
        borderRadius: '20px',
        padding: '1%',
        ...containerStyle, // Allow dynamic styling via props
      }}
      aria-label="Opportunities Stages Chart"
    >
      <Bar
        data={filteredChartData}
        options={{
          responsive: true,
          indexAxis: 'x', // This makes the bars horizontal
          plugins: {
            title: {
              display: true,
              text: 'Opportunities Stages By User',
            },
            legend: {
              position: 'right',
              onClick: handleLegendClick, // Custom legend click handler
            },
          },
          scales: {
            x: {
              stacked: true, // Enable stacking on x-axis
              beginAtZero: true,
            },
            y: {
              stacked: true, // Enable stacking on y-axis
              beginAtZero: true,
            },
          },
        }}
      />
    </div>
  );
});

export default OpportunitiesStagesChart;
