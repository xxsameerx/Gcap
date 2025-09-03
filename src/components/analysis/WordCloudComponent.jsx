import React, { useMemo } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';
import { FaCloud, FaHashtag, FaChartLine, FaFilter } from 'react-icons/fa';

const WordCloudComponent = ({ data, title = "Key Themes Analysis" }) => {
  const wordCloudData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Extract all text and count word frequency by sentiment
    const sentimentWords = data.reduce((acc, item) => {
      const text = (item.comment || item.feedback || item.text || '').toLowerCase();
      const sentiment = item.sentiment || 'neutral';
      
      if (!acc[sentiment]) acc[sentiment] = {};
      
      const words = text
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => 
          word.length > 3 && 
          !['this', 'that', 'with', 'have', 'will', 'been', 'their', 'they', 'them', 'should', 'would', 'could', 'about', 'after', 'before', 'during', 'while', 'where', 'when', 'what', 'which', 'these', 'those', 'from', 'into', 'than', 'more', 'some', 'very', 'also', 'only', 'just', 'like', 'much', 'such', 'many', 'make', 'time', 'good', 'work', 'well', 'think', 'know', 'said', 'people', 'come', 'take', 'get'].includes(word)
        );

      words.forEach(word => {
        acc[sentiment][word] = (acc[sentiment][word] || 0) + 1;
      });

      return acc;
    }, {});

    // Combine all words and calculate total frequency
    const allWords = {};
    Object.values(sentimentWords).forEach(sentimentWordMap => {
      Object.entries(sentimentWordMap).forEach(([word, count]) => {
        if (!allWords[word]) {
          allWords[word] = { total: 0, positive: 0, negative: 0, neutral: 0 };
        }
        allWords[word].total += count;
      });
    });

    // Add sentiment breakdown
    Object.entries(sentimentWords).forEach(([sentiment, wordMap]) => {
      Object.entries(wordMap).forEach(([word, count]) => {
        if (allWords[word]) {
          allWords[word][sentiment] = count;
        }
      });
    });

    // Convert to sorted array and get top 40 words
    return Object.entries(allWords)
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 40)
      .map(([text, data]) => ({
        text,
        value: data.total,
        positive: data.positive || 0,
        negative: data.negative || 0,
        neutral: data.neutral || 0,
        dominantSentiment: data.positive > data.negative && data.positive > data.neutral ? 'positive' :
                          data.negative > data.positive && data.negative > data.neutral ? 'negative' : 'neutral'
      }));
  }, [data]);

  const getWordSize = (value, maxValue) => {
    const minSize = 16;
    const maxSize = 48;
    return minSize + ((value / maxValue) * (maxSize - minSize));
  };

  const getWordColor = (dominantSentiment, value, maxValue) => {
    const intensity = value / maxValue;
    const colors = {
      positive: `rgba(34, 197, 94, ${0.6 + intensity * 0.4})`,
      negative: `rgba(239, 68, 68, ${0.6 + intensity * 0.4})`,
      neutral: `rgba(251, 191, 36, ${0.6 + intensity * 0.4})`
    };
    return colors[dominantSentiment] || colors.neutral;
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <FaCloud className="me-2" />
            {title}
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <FaCloud size={48} className="text-muted mb-3" />
          <p className="text-muted">No data available for word cloud</p>
        </Card.Body>
      </Card>
    );
  }

  if (wordCloudData.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">
            <FaCloud className="me-2" />
            {title}
          </h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <FaFilter size={48} className="text-muted mb-3" />
          <p className="text-muted">Not enough text data to generate word cloud</p>
        </Card.Body>
      </Card>
    );
  }

  const maxValue = Math.max(...wordCloudData.map(w => w.value));

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-info text-white">
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">
              <FaCloud className="me-2" />
              {title}
            </h5>
          </Col>
          <Col xs="auto">
            <Badge bg="light" text="dark" className="px-3 py-2">
              <FaHashtag className="me-1" />
              {wordCloudData.length} Keywords
            </Badge>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {/* Interactive Word Cloud */}
        <div className="word-cloud-container bg-light rounded p-4 mb-4" style={{ minHeight: '400px' }}>
          <div className="d-flex flex-wrap justify-content-center align-items-center">
            {wordCloudData.map((word, index) => (
              <span
                key={word.text}
                className="word-cloud-item m-2"
                style={{
                  fontSize: `${getWordSize(word.value, maxValue)}px`,
                  color: getWordColor(word.dominantSentiment, word.value, maxValue),
                  fontWeight: '700',
                  textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  userSelect: 'none',
                  padding: '6px 12px',
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.8)',
                  backdropFilter: 'blur(10px)',
                  border: `2px solid ${getWordColor(word.dominantSentiment, word.value, maxValue)}`,
                  position: 'relative',
                }}
                onClick={() => {
                  console.log(`Clicked on "${word.text}":`, word);
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.2) rotate(2deg)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.95)';
                  e.target.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.25)';
                  e.target.style.zIndex = '10';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1) rotate(0deg)';
                  e.target.style.background = 'rgba(255, 255, 255, 0.8)';
                  e.target.style.boxShadow = 'none';
                  e.target.style.zIndex = '1';
                }}
                title={`${word.text}: ${word.value} occurrences
Positive: ${word.positive} | Negative: ${word.negative} | Neutral: ${word.neutral}`}
              >
                {word.text}
              </span>
            ))}
          </div>
        </div>
        
        {/* Legend */}
        <div className="text-center mb-4">
          <small className="text-muted me-4">Color Legend:</small>
          <Badge bg="success" className="me-2">Positive Words</Badge>
          <Badge bg="danger" className="me-2">Negative Words</Badge>
          <Badge bg="warning" className="me-2">Neutral Words</Badge>
        </div>
        
        {/* Top Keywords by Sentiment */}
        <Row>
          <Col md={4}>
            <Card className="border-success">
              <Card.Header className="bg-success text-white py-2">
                <h6 className="mb-0">
                  <FaChartLine className="me-2" />
                  Top Positive Keywords
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-wrap">
                  {wordCloudData
                    .filter(word => word.dominantSentiment === 'positive')
                    .slice(0, 8)
                    .map((word, index) => (
                      <Badge 
                        key={word.text}
                        bg="success" 
                        className="me-2 mb-2 opacity-75"
                        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                      >
                        {word.text} ({word.positive})
                      </Badge>
                    ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-danger">
              <Card.Header className="bg-danger text-white py-2">
                <h6 className="mb-0">
                  <FaChartLine className="me-2" />
                  Top Negative Keywords
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-wrap">
                  {wordCloudData
                    .filter(word => word.dominantSentiment === 'negative')
                    .slice(0, 8)
                    .map((word, index) => (
                      <Badge 
                        key={word.text}
                        bg="danger" 
                        className="me-2 mb-2 opacity-75"
                        style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                      >
                        {word.text} ({word.negative})
                      </Badge>
                    ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
          <Col md={4}>
            <Card className="border-warning">
              <Card.Header className="bg-warning text-dark py-2">
                <h6 className="mb-0">
                  <FaChartLine className="me-2" />
                  Most Frequent Overall
                </h6>
              </Card.Header>
              <Card.Body className="p-3">
                <div className="d-flex flex-wrap">
                  {wordCloudData.slice(0, 8).map((word, index) => (
                    <Badge 
                      key={word.text}
                      bg="primary" 
                      className="me-2 mb-2"
                      style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                    >
                      {word.text} ({word.value})
                    </Badge>
                  ))}
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
        
        {/* Statistics */}
        <Card className="bg-light mt-4">
          <Card.Body>
            <Row className="text-center">
              <Col md={3}>
                <h5 className="text-primary mb-1">{wordCloudData.length}</h5>
                <small className="text-muted">Unique Keywords</small>
              </Col>
              <Col md={3}>
                <h5 className="text-success mb-1">
                  {wordCloudData.filter(w => w.dominantSentiment === 'positive').length}
                </h5>
                <small className="text-muted">Positive Terms</small>
              </Col>
              <Col md={3}>
                <h5 className="text-danger mb-1">
                  {wordCloudData.filter(w => w.dominantSentiment === 'negative').length}
                </h5>
                <small className="text-muted">Negative Terms</small>
              </Col>
              <Col md={3}>
                <h5 className="text-warning mb-1">
                  {wordCloudData.filter(w => w.dominantSentiment === 'neutral').length}
                </h5>
                <small className="text-muted">Neutral Terms</small>
              </Col>
            </Row>
          </Card.Body>
        </Card>
        
        <div className="mt-3 text-center">
          <small className="text-muted">
            💡 Hover over words for details • Click to analyze • Size indicates frequency
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WordCloudComponent;
