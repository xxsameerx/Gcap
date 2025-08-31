import React, { useMemo } from 'react';
import { Card, Row, Col, Badge } from 'react-bootstrap';

const WordCloudComponent = ({ data, title = "Key Themes" }) => {
  const wordCloudData = useMemo(() => {
    if (!data || data.length === 0) return [];

    // Extract all text and count word frequency
    const allText = data.map(item => 
      (item.comment || item.feedback || item.text || '').toLowerCase()
    ).join(' ');

    // Simple word extraction and counting
    const words = allText
      .replace(/[^\w\s]/g, '')
      .split(/\s+/)
      .filter(word => 
        word.length > 3 && // Filter out short words
        !['this', 'that', 'with', 'have', 'will', 'been', 'their', 'they', 'them', 'should', 'would', 'could', 'about', 'after', 'before', 'during', 'while', 'where', 'when', 'what', 'which', 'these', 'those', 'from', 'into', 'than', 'more', 'some', 'very', 'also', 'only', 'just', 'like', 'much', 'such', 'many'].includes(word)
      );

    const wordCount = words.reduce((acc, word) => {
      acc[word] = (acc[word] || 0) + 1;
      return acc;
    }, {});

    // Convert to sorted array and get top 30 words
    return Object.entries(wordCount)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 30)
      .map(([text, value]) => ({ text, value }));
  }, [data]);

  const getWordSize = (value, maxValue) => {
    const minSize = 14;
    const maxSize = 42;
    return minSize + ((value / maxValue) * (maxSize - minSize));
  };

  const getWordColor = (index) => {
    const colors = ['#1e40af', '#16a34a', '#dc2626', '#ea580c', '#7c3aed', '#0891b2', '#059669', '#7c2d12'];
    return colors[index % colors.length];
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <p className="text-muted">No data available for word cloud</p>
        </Card.Body>
      </Card>
    );
  }

  if (wordCloudData.length === 0) {
    return (
      <Card>
        <Card.Header>
          <h5 className="mb-0">{title}</h5>
        </Card.Header>
        <Card.Body className="text-center py-5">
          <p className="text-muted">Not enough text data to generate word cloud</p>
        </Card.Body>
      </Card>
    );
  }

  const maxValue = Math.max(...wordCloudData.map(w => w.value));

  return (
    <Card>
      <Card.Header>
        <h5 className="mb-0">{title}</h5>
      </Card.Header>
      <Card.Body>
        <div className="word-cloud-container d-flex flex-wrap justify-content-center align-items-center p-4">
          {wordCloudData.map((word, index) => (
            <span
              key={word.text}
              className="word-cloud-item m-2"
              style={{
                fontSize: `${getWordSize(word.value, maxValue)}px`,
                color: getWordColor(index),
                fontWeight: '600',
                textShadow: '2px 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.3s ease',
                cursor: 'pointer',
                userSelect: 'none',
                padding: '4px 8px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.1)',
                backdropFilter: 'blur(5px)'
              }}
              onClick={() => {
                console.log(`Clicked on "${word.text}" (${word.value} occurrences)`);
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.15)';
                e.target.style.background = 'rgba(255, 255, 255, 0.2)';
                e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
              title={`${word.text}: ${word.value} occurrences`}
            >
              {word.text}
            </span>
          ))}
        </div>
        
        <hr />
        
        <Row>
          <Col>
            <h6 className="mb-3">Top Keywords</h6>
            <div className="d-flex flex-wrap">
              {wordCloudData.slice(0, 10).map((word, index) => (
                <Badge 
                  key={word.text}
                  bg="primary" 
                  className="me-2 mb-2"
                  style={{ fontSize: '0.85rem', padding: '6px 12px' }}
                >
                  {word.text} ({word.value})
                </Badge>
              ))}
            </div>
          </Col>
        </Row>
        
        <div className="mt-3 text-center">
          <small className="text-muted">
            Click on words to see more details • Showing top {wordCloudData.length} keywords
          </small>
        </div>
      </Card.Body>
    </Card>
  );
};

export default WordCloudComponent;
