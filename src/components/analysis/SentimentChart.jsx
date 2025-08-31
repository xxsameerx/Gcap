import React from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaHeart, FaFrown, FaMeh } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const SentimentChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <p className="text-muted">No sentiment data available</p>
        </Card.Body>
      </Card>
    );
  }

  // Calculate sentiment distribution
  const sentimentCounts = data.reduce((acc, item) => {
    const sentiment = item.sentiment || 'neutral';
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const total = data.length;
  const positive = sentimentCounts.positive || 0;
  const negative = sentimentCounts.negative || 0;
  const neutral = sentimentCounts.neutral || 0;

  // Pie chart data
  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [positive, negative, neutral],
        backgroundColor: [
          '#16a34a',
          '#dc2626',
          '#ea580c',
        ],
        borderColor: [
          '#15803d',
          '#b91c1c',
          '#c2410c',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Bar chart data (sentiment over time or categories)
  const barData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Number of Comments',
        data: [positive, negative, neutral],
        backgroundColor: [
          'rgba(22, 163, 74, 0.8)',
          'rgba(220, 38, 38, 0.8)',
          'rgba(234, 88, 12, 0.8)',
        ],
        borderColor: [
          '#16a34a',
          '#dc2626',
          '#ea580c',
        ],
        borderWidth: 2,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const percentage = ((context.parsed / total) * 100).toFixed(1);
            return `${context.label}: ${context.parsed} (${percentage}%)`;
          }
        }
      }
    },
  };

  const barOptions = {
    ...chartOptions,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">Sentiment Analysis Results</h5>
      </Card.Header>
      <Card.Body>
        {/* Summary Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-success">
              <Card.Body className="text-center">
                <FaHeart className="text-success mb-2" size={24} />
                <h4 className="text-success mb-1">{positive}</h4>
                <small className="text-muted">
                  Positive ({((positive / total) * 100).toFixed(1)}%)
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-danger">
              <Card.Body className="text-center">
                <FaFrown className="text-danger mb-2" size={24} />
                <h4 className="text-danger mb-1">{negative}</h4>
                <small className="text-muted">
                  Negative ({((negative / total) * 100).toFixed(1)}%)
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-warning">
              <Card.Body className="text-center">
                <FaMeh className="text-warning mb-2" size={24} />
                <h4 className="text-warning mb-1">{neutral}</h4>
                <small className="text-muted">
                  Neutral ({((neutral / total) * 100).toFixed(1)}%)
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Charts */}
        <Row>
          <Col lg={6}>
            <div className="chart-container mb-4">
              <h6 className="text-center mb-3">Sentiment Distribution</h6>
              <Pie data={pieData} options={chartOptions} />
            </div>
          </Col>
          <Col lg={6}>
            <div className="chart-container mb-4">
              <h6 className="text-center mb-3">Sentiment Breakdown</h6>
              <Bar data={barData} options={barOptions} />
            </div>
          </Col>
        </Row>

        {/* Overall Sentiment */}
        <div className="text-center mt-3">
          <h6>Overall Sentiment</h6>
          <Badge 
            bg={positive > negative + neutral ? 'success' : 
                negative > positive + neutral ? 'danger' : 'warning'}
            className="px-3 py-2"
          >
            {positive > negative + neutral ? 'Mostly Positive' : 
             negative > positive + neutral ? 'Mostly Negative' : 'Mixed/Neutral'}
          </Badge>
        </div>
      </Card.Body>
    </Card>
  );
};

export default SentimentChart;
