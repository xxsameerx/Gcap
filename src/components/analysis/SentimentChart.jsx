import React from 'react';
import { Card, Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { Pie, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement,
} from 'chart.js';
import { FaHeart, FaFrown, FaMeh, FaChartPie, FaTrophy, FaExclamationTriangle } from 'react-icons/fa';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const SentimentChart = ({ data }) => {
  // Safe number formatter
  const safeToFixed = (value, decimals = 1) => {
    if (value === null || value === undefined) return '0.0';
    const num = Number(value);
    if (isNaN(num)) return '0.0';
    return num.toFixed(decimals);
  };

  // Safe value extractor
  const getParsedValue = (context) => {
    if (!context || !context.parsed) return 0;
    
    // For pie charts, parsed is usually a number directly
    if (typeof context.parsed === 'number') {
      return context.parsed;
    }
    
    // For bar charts, parsed might be an object like {x: ..., y: ...}
    if (typeof context.parsed === 'object') {
      return context.parsed.y || context.parsed.x || context.parsed || 0;
    }
    
    return Number(context.parsed) || 0;
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <FaChartPie size={48} className="text-muted mb-3" />
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

  // Calculate average confidence scores
  const avgConfidence = data.reduce((sum, item) => sum + (Number(item.confidence) || 0), 0) / total;
  
  // Calculate average probabilities across all comments
  const avgProbabilities = data.reduce((acc, item) => {
    if (item.probabilities && typeof item.probabilities === 'object') {
      acc.positive += Number(item.probabilities.Positive) || 0;
      acc.negative += Number(item.probabilities.Negative) || 0;
      acc.neutral += Number(item.probabilities.Neutral) || 0;
    }
    return acc;
  }, { positive: 0, negative: 0, neutral: 0 });

  avgProbabilities.positive /= total;
  avgProbabilities.negative /= total;
  avgProbabilities.neutral /= total;

  // Enhanced pie chart data
  const pieData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        data: [positive, negative, neutral],
        backgroundColor: [
          'rgba(34, 197, 94, 0.9)',
          'rgba(239, 68, 68, 0.9)',
          'rgba(251, 191, 36, 0.9)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 3,
        hoverOffset: 6,
      },
    ],
  };

  // Confidence distribution chart
  const confidenceData = {
    labels: ['High Confidence (>80%)', 'Medium Confidence (50-80%)', 'Low Confidence (<50%)'],
    datasets: [
      {
        label: 'Confidence Levels',
        data: [
          data.filter(item => (Number(item.confidence) || 0) > 0.8).length,
          data.filter(item => {
            const conf = Number(item.confidence) || 0;
            return conf >= 0.5 && conf <= 0.8;
          }).length,
          data.filter(item => (Number(item.confidence) || 0) < 0.5).length,
        ],
        backgroundColor: [
          'rgba(16, 185, 129, 0.8)',
          'rgba(59, 130, 246, 0.8)',
          'rgba(156, 163, 175, 0.8)',
        ],
        borderColor: [
          'rgba(16, 185, 129, 1)',
          'rgba(59, 130, 246, 1)',
          'rgba(156, 163, 175, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // Probability comparison chart
  const probabilityData = {
    labels: ['Positive', 'Negative', 'Neutral'],
    datasets: [
      {
        label: 'Average Probability',
        data: [
          avgProbabilities.positive * 100,
          avgProbabilities.negative * 100,
          avgProbabilities.neutral * 100
        ],
        backgroundColor: [
          'rgba(34, 197, 94, 0.7)',
          'rgba(239, 68, 68, 0.7)',
          'rgba(251, 191, 36, 0.7)',
        ],
        borderColor: [
          'rgba(34, 197, 94, 1)',
          'rgba(239, 68, 68, 1)',
          'rgba(251, 191, 36, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  // SAFE CHART OPTIONS WITH FIXED TOOLTIP CALLBACKS
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            try {
              const label = context.label || context.dataset.label || '';
              const value = getParsedValue(context);
              const percentage = safeToFixed((value / total) * 100, 1);
              return `${label}: ${value} (${percentage}%)`;
            } catch (error) {
              console.warn('Tooltip error:', error);
              return `${context.label || 'Unknown'}: ${getParsedValue(context)}`;
            }
          }
        }
      }
    },
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            try {
              const label = context.dataset.label || '';
              const value = getParsedValue(context);
              return `${label}: ${safeToFixed(value, 1)}%`;
            } catch (error) {
              console.warn('Tooltip error:', error);
              return `${context.dataset?.label || 'Unknown'}: ${getParsedValue(context)}%`;
            }
          }
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return safeToFixed(value, 0) + '%';
          }
        },
      },
    },
  };

  const confidenceOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          padding: 20,
          font: {
            size: 12,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            try {
              const label = context.dataset.label || '';
              const value = getParsedValue(context);
              return `${label}: ${value} comments`;
            } catch (error) {
              console.warn('Tooltip error:', error);
              return `${context.dataset?.label || 'Unknown'}: ${getParsedValue(context)}`;
            }
          }
        }
      }
    },
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
    <Card className="shadow-sm">
      <Card.Header className="bg-primary text-white">
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">
              <FaChartPie className="me-2" />
              AI Sentiment Analysis Results
            </h5>
          </Col>
          <Col xs="auto">
            <Badge bg="light" text="dark" className="px-3 py-2">
              <FaTrophy className="me-1" />
              Avg Confidence: {safeToFixed(avgConfidence * 100, 1)}%
            </Badge>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {/* Enhanced Summary Cards */}
        <Row className="mb-4">
          <Col md={4}>
            <Card className="border-success shadow-sm h-100">
              <Card.Body className="text-center">
                <FaHeart className="text-success mb-3" size={32} />
                <h2 className="text-success mb-2">{positive}</h2>
                <h6 className="mb-3">
                  <Badge bg="success" className="px-3 py-2">
                    {safeToFixed((positive / total) * 100, 1)}% Positive
                  </Badge>
                </h6>
                <ProgressBar 
                  variant="success" 
                  now={(positive / total) * 100} 
                  style={{ height: '10px' }}
                  className="mb-2"
                />
                <small className="text-muted">
                  <strong>Avg Probability:</strong> {safeToFixed(avgProbabilities.positive * 100, 1)}%
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-danger shadow-sm h-100">
              <Card.Body className="text-center">
                <FaFrown className="text-danger mb-3" size={32} />
                <h2 className="text-danger mb-2">{negative}</h2>
                <h6 className="mb-3">
                  <Badge bg="danger" className="px-3 py-2">
                    {safeToFixed((negative / total) * 100, 1)}% Negative
                  </Badge>
                </h6>
                <ProgressBar 
                  variant="danger" 
                  now={(negative / total) * 100} 
                  style={{ height: '10px' }}
                  className="mb-2"
                />
                <small className="text-muted">
                  <strong>Avg Probability:</strong> {safeToFixed(avgProbabilities.negative * 100, 1)}%
                </small>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-warning shadow-sm h-100">
              <Card.Body className="text-center">
                <FaMeh className="text-warning mb-3" size={32} />
                <h2 className="text-warning mb-2">{neutral}</h2>
                <h6 className="mb-3">
                  <Badge bg="warning" className="px-3 py-2">
                    {safeToFixed((neutral / total) * 100, 1)}% Neutral
                  </Badge>
                </h6>
                <ProgressBar 
                  variant="warning" 
                  now={(neutral / total) * 100} 
                  style={{ height: '10px' }}
                  className="mb-2"
                />
                <small className="text-muted">
                  <strong>Avg Probability:</strong> {safeToFixed(avgProbabilities.neutral * 100, 1)}%
                </small>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Enhanced Charts */}
        <Row className="mb-4">
          <Col lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0 text-center">📊 Sentiment Distribution</h6>
              </Card.Header>
              <Card.Body>
                <div className="chart-container" style={{ height: '350px' }}>
                  <Pie data={pieData} options={chartOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col lg={6} className="mb-4">
            <Card className="h-100">
              <Card.Header>
                <h6 className="mb-0 text-center">🎯 Confidence Distribution</h6>
              </Card.Header>
              <Card.Body>
                <div className="chart-container" style={{ height: '350px' }}>
                  <Doughnut data={confidenceData} options={confidenceOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col lg={12}>
            <Card>
              <Card.Header>
                <h6 className="mb-0 text-center">📈 Average Sentiment Probabilities</h6>
              </Card.Header>
              <Card.Body>
                <div className="chart-container" style={{ height: '300px' }}>
                  <Bar data={probabilityData} options={barOptions} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Analysis Summary */}
        <Card className="bg-gradient-light border-0">
          <Card.Body>
            <Row>
              <Col md={8}>
                <h6 className="mb-3">
                  <FaExclamationTriangle className="text-warning me-2" />
                  Analysis Summary
                </h6>
                <Row>
                  <Col sm={6}>
                    <div className="mb-2">
                      <strong>Dominant Sentiment:</strong>{' '}
                      <Badge 
                        bg={positive > negative && positive > neutral ? 'success' : 
                            negative > positive && negative > neutral ? 'danger' : 'warning'}
                        className="ms-1"
                      >
                        {positive > negative && positive > neutral ? 'Positive' : 
                         negative > positive && negative > neutral ? 'Negative' : 'Neutral'}
                      </Badge>
                    </div>
                    <div className="mb-2">
                      <strong>Total Comments:</strong> {total}
                    </div>
                    <div className="mb-2">
                      <strong>Processing Accuracy:</strong> {
                        data.filter(item => (Number(item.confidence) || 0) > 0.5).length
                      }/{total} ({
                        safeToFixed((data.filter(item => (Number(item.confidence) || 0) > 0.5).length / total) * 100, 1)
                      }%)
                    </div>
                  </Col>
                  <Col sm={6}>
                    <div className="mb-2">
                      <strong>High Confidence:</strong> {data.filter(item => (Number(item.confidence) || 0) > 0.8).length} comments
                    </div>
                    <div className="mb-2">
                      <strong>Medium Confidence:</strong> {data.filter(item => {
                        const conf = Number(item.confidence) || 0;
                        return conf >= 0.5 && conf <= 0.8;
                      }).length} comments
                    </div>
                    <div className="mb-2">
                      <strong>Low Confidence:</strong> {data.filter(item => (Number(item.confidence) || 0) < 0.5).length} comments
                    </div>
                  </Col>
                </Row>
              </Col>
              <Col md={4} className="text-center">
                <div className="p-3 bg-white rounded border">
                  <h5 className="text-primary mb-2">{safeToFixed(avgConfidence * 100, 1)}%</h5>
                  <p className="mb-0 small text-muted">Overall Confidence Score</p>
                  <ProgressBar 
                    variant={avgConfidence > 0.8 ? 'success' : avgConfidence > 0.6 ? 'warning' : 'danger'}
                    now={avgConfidence * 100} 
                    style={{ height: '6px' }}
                    className="mt-2"
                  />
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Card.Body>
    </Card>
  );
};

export default SentimentChart;
