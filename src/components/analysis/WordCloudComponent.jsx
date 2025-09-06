import React, { useMemo, useState, useCallback } from 'react';
import { Card, Row, Col, Badge, Button, Form, InputGroup, Dropdown, Modal, Alert } from 'react-bootstrap';
import { 
  FaCloud, 
  FaHashtag, 
  FaChartLine, 
  FaFilter, 
  FaSearchPlus,
  FaDownload,
  FaInfoCircle,
  FaEye,
  FaThumbsUp,
  FaThumbsDown,
  FaMinus,
  FaPalette,
  FaMoon,
  FaSun,
  FaFileImage,
  FaFileExport,
  FaFilePdf
} from 'react-icons/fa';

const WordCloudComponent = ({ 
  data, 
  title = "Intelligent Keyword Analysis", 
  onWordClick = null,
  showFilters = true,
  downloadable = true 
}) => {
  const [selectedSentiment, setSelectedSentiment] = useState('all');
  const [minWordCount, setMinWordCount] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [isHeatmapMode, setIsHeatmapMode] = useState(false);
  const [hoveredWord, setHoveredWord] = useState(null);
  const [currentTheme, setCurrentTheme] = useState('default');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [exportModalShow, setExportModalShow] = useState(false);

  // Custom color themes
  const themes = {
    default: {
      name: 'Government Blue',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb'
    },
    ocean: {
      name: 'Ocean Breeze',
      primary: '#00c9ff',
      secondary: '#92fe9d',
      accent: '#667eea'
    },
    sunset: {
      name: 'Sunset Glow',
      primary: '#fc466b',
      secondary: '#3f5efb',
      accent: '#f093fb'
    },
    forest: {
      name: 'Forest Green',
      primary: '#56ab2f',
      secondary: '#a8edea',
      accent: '#fed6e3'
    },
    cosmic: {
      name: 'Cosmic Purple',
      primary: '#667eea',
      secondary: '#764ba2',
      accent: '#f093fb'
    }
  };

  const wordCloudData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const sentimentWords = data.reduce((acc, item) => {
      const text = (item.comment || item.feedback || item.text || '').toLowerCase();
      const sentiment = item.sentiment || 'neutral';
      
      if (!acc[sentiment]) acc[sentiment] = {};
      
      const stopwords = new Set([
        'this', 'that', 'with', 'have', 'will', 'been', 'their', 'they', 'them', 
        'should', 'would', 'could', 'about', 'after', 'before', 'during', 'while', 
        'where', 'when', 'what', 'which', 'these', 'those', 'from', 'into', 'than', 
        'more', 'some', 'very', 'also', 'only', 'just', 'like', 'much', 'such', 
        'many', 'make', 'time', 'good', 'work', 'well', 'think', 'know', 'said', 
        'people', 'come', 'take', 'government', 'policy', 'india', 'indian', 'citizen'
      ]);

      const words = text
        .replace(/[^\w\s]/g, ' ')
        .split(/\s+/)
        .filter(word => 
          word.length > 3 && 
          !stopwords.has(word) &&
          !/^\d+$/.test(word) && 
          /[a-zA-Z]/.test(word)
        );

      words.forEach(word => {
        acc[sentiment][word] = (acc[sentiment][word] || 0) + 1;
      });

      return acc;
    }, {});

    const allWords = {};
    Object.entries(sentimentWords).forEach(([sentiment, wordMap]) => {
      Object.entries(wordMap).forEach(([word, count]) => {
        if (!allWords[word]) {
          allWords[word] = { total: 0, positive: 0, negative: 0, neutral: 0 };
        }
        allWords[word].total += count;
        allWords[word][sentiment] = count;
      });
    });

    return Object.entries(allWords)
      .filter(([word, data]) => {
        if (data.total < minWordCount) return false;
        if (searchTerm && !word.includes(searchTerm.toLowerCase())) return false;
        return true;
      })
      .sort(([,a], [,b]) => b.total - a.total)
      .slice(0, 60)
      .map(([text, data]) => ({
        text,
        value: data.total,
        positive: data.positive || 0,
        negative: data.negative || 0,
        neutral: data.neutral || 0,
        dominantSentiment: data.positive > data.negative && data.positive > data.neutral ? 'positive' :
                          data.negative > data.positive && data.negative > data.neutral ? 'negative' : 'neutral',
        sentimentScore: ((data.positive - data.negative) / data.total).toFixed(2)
      }))
      .filter(word => selectedSentiment === 'all' || word.dominantSentiment === selectedSentiment);
  }, [data, selectedSentiment, minWordCount, searchTerm]);

  const getWordSize = useCallback((value, maxValue) => {
    const minSize = 12;
    const maxSize = 56;
    const size = minSize + ((value / maxValue) * (maxSize - minSize));
    return Math.round(size);
  }, []);

const getSentimentColor = useCallback((sentiment, intensity = 1) => {
  const colors = {
    positive: {
      bg: `hsla(142, 71%, ${45 + intensity * 15}%, ${0.8 + intensity * 0.2})`,
      border: `hsla(142, 71%, ${35 + intensity * 10}%, ${0.9 + intensity * 0.1})`,
      text: isDarkMode ? '#10b981' : '#059669'
    },
    negative: {
      // Fixed: Brighter red colors for dark mode visibility
      bg: isDarkMode 
        ? `hsla(0, 85%, ${65 + intensity * 15}%, ${0.9 + intensity * 0.1})` 
        : `hsla(0, 84%, ${55 + intensity * 10}%, ${0.8 + intensity * 0.2})`,
      border: isDarkMode 
        ? `hsla(0, 85%, ${55 + intensity * 10}%, ${0.95 + intensity * 0.05})` 
        : `hsla(0, 84%, ${45 + intensity * 5}%, ${0.9 + intensity * 0.1})`,
      text: isDarkMode ? '#ff6b6b' : '#dc2626'  // Brighter red for dark mode
    },
    neutral: {
      bg: isDarkMode 
        ? `hsla(45, 93%, ${65 + intensity * 10}%, ${0.9 + intensity * 0.1})`
        : `hsla(45, 93%, ${55 + intensity * 10}%, ${0.8 + intensity * 0.2})`,
      border: isDarkMode 
        ? `hsla(45, 93%, ${55 + intensity * 5}%, ${0.95 + intensity * 0.05})`
        : `hsla(45, 93%, ${45 + intensity * 5}%, ${0.9 + intensity * 0.1})`,
      text: isDarkMode ? '#fbbf24' : '#d97706'
    }
  };
  return colors[sentiment] || colors.neutral;
}, [isDarkMode]);


  const getWordColors = useCallback((word, maxValue) => {
    if (isHeatmapMode) {
      const intensity = word.value / maxValue;
      const hue = 240 - (intensity * 180);
      const saturation = 70 + (intensity * 30);
      const lightness = isDarkMode ? 60 + (intensity * 20) : 40 + (intensity * 20);
      
      return {
        bg: `hsla(${hue}, ${saturation}%, ${lightness}%, ${0.8 + intensity * 0.2})`,
        border: `hsla(${hue}, ${saturation}%, ${lightness - 10}%, 0.9)`,
        text: intensity > 0.6 ? '#ffffff' : isDarkMode ? '#f1f5f9' : '#1f2937'
      };
    } else {
      return getSentimentColor(word.dominantSentiment, word.value / maxValue);
    }
  }, [isHeatmapMode, getSentimentColor, isDarkMode]);

  const handleWordClick = useCallback((word) => {
    if (onWordClick) {
      onWordClick(word);
    }
    console.log('Word clicked:', word);
  }, [onWordClick]);

  // Export functions
  const exportAsImage = useCallback(async (format = 'png') => {
    const element = document.querySelector('.word-cloud-container');
    if (!element) return;

    try {
      const html2canvas = (await import('html2canvas')).default;
      const canvas = await html2canvas(element, {
        backgroundColor: isDarkMode ? '#1f2937' : '#ffffff',
        scale: 2,
        useCORS: true
      });

      const link = document.createElement('a');
      link.download = `wordcloud-${Date.now()}.${format}`;
      
      if (format === 'png') {
        link.href = canvas.toDataURL('image/png');
      } else if (format === 'pdf') {
        const jsPDF = (await import('jspdf')).default;
        const pdf = new jsPDF();
        const imgData = canvas.toDataURL('image/png');
        pdf.addImage(imgData, 'PNG', 10, 10, 180, 120);
        pdf.save(`wordcloud-${Date.now()}.pdf`);
        return;
      }
      
      link.click();
    } catch (error) {
      console.error('Export failed:', error);
      alert('Export failed. Please try again.');
    }
  }, [isDarkMode]);

  const exportData = useCallback((format = 'json') => {
    const exportData = {
      metadata: {
        title,
        exportDate: new Date().toISOString(),
        totalWords: wordCloudData.length,
        theme: currentTheme,
        mode: isHeatmapMode ? 'heatmap' : 'sentiment'
      },
      words: wordCloudData.map(word => ({
        text: word.text,
        frequency: word.value,
        sentiment: word.dominantSentiment,
        sentimentScore: word.sentimentScore,
        positive: word.positive,
        negative: word.negative,
        neutral: word.neutral
      }))
    };

    const dataStr = format === 'json' 
      ? JSON.stringify(exportData, null, 2)
      : convertToCSV(exportData.words);
    
    const blob = new Blob([dataStr], { 
      type: format === 'json' ? 'application/json' : 'text/csv' 
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `wordcloud-data-${Date.now()}.${format}`;
    link.click();
    URL.revokeObjectURL(url);
  }, [wordCloudData, title, currentTheme, isHeatmapMode]);

  const convertToCSV = (data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(','))
    ].join('\n');
    return csvContent;
  };

  const maxValue = Math.max(...wordCloudData.map(w => w.value), 1);

  if (!data || data.length === 0) {
    return (
      <Card className={`shadow-lg border-0 rounded-3 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Body className="text-center py-5">
          <div className="text-muted mb-4">
            <FaCloud size={64} className="opacity-50" />
          </div>
          <h5 className="text-muted mb-3">No Data Available</h5>
          <p className="text-muted">Upload or provide data to generate word cloud visualization</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className={`word-cloud-dashboard ${isDarkMode ? 'dark-theme' : ''}`}>
      <Card className={`shadow-sm border-0 rounded-3 mb-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Header 
          className="text-white border-0 rounded-top-3" 
          style={{
            background: `linear-gradient(135deg, ${themes[currentTheme].primary} 0%, ${themes[currentTheme].secondary} 100%)`
          }}
        >
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-1 fw-bold">
                <FaCloud className="me-2" />
                {title}
              </h4>
              <small className="opacity-90">
                AI-powered semantic analysis with interactive visualization
              </small>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2 align-items-center flex-wrap">
                <Dropdown>
                  <Dropdown.Toggle variant="light" size="sm" className="px-3">
                    <FaPalette className="me-1" />
                    {themes[currentTheme].name}
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    {Object.entries(themes).map(([key, theme]) => (
                      <Dropdown.Item 
                        key={key}
                        onClick={() => setCurrentTheme(key)}
                        active={currentTheme === key}
                      >
                        <div 
                          className="d-inline-block me-2 rounded-circle"
                          style={{
                            width: '12px',
                            height: '12px',
                            background: `linear-gradient(45deg, ${theme.primary}, ${theme.secondary})`
                          }}
                        />
                        {theme.name}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>

                <Button
                  variant={isDarkMode ? "warning" : "outline-light"}
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="px-3"
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                </Button>

                <Badge bg="light" text="dark" className="px-3 py-2 fw-semibold">
                  <FaHashtag className="me-1" />
                  {wordCloudData.length} Keywords
                </Badge>

                {downloadable && (
                  <Button 
                    variant="light" 
                    size="sm" 
                    className="px-3"
                    onClick={() => setExportModalShow(true)}
                  >
                    <FaDownload className="me-1" />
                    Export
                  </Button>
                )}
              </div>
            </Col>
          </Row>
        </Card.Header>

        {showFilters && (
          <Card.Header className={`border-0 py-3 ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
            <Row className="g-3 align-items-end">
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Filter by Sentiment</Form.Label>
                  <Form.Select 
                    value={selectedSentiment}
                    onChange={(e) => setSelectedSentiment(e.target.value)}
                    className="form-select-sm"
                  >
                    <option value="all">All Sentiments</option>
                    <option value="positive">Positive Only</option>
                    <option value="negative">Negative Only</option>
                    <option value="neutral">Neutral Only</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Min Frequency</Form.Label>
                  <Form.Range
                    value={minWordCount}
                    onChange={(e) => setMinWordCount(parseInt(e.target.value))}
                    min="1"
                    max="10"
                    className="form-range-sm"
                  />
                  <small className="text-muted">{minWordCount}+ occurrences</small>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-semibold small">Search Keywords</Form.Label>
                  <InputGroup>
                    <Form.Control
                      type="text"
                      placeholder="Search for specific words..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="form-control-sm"
                    />
                    <InputGroup.Text className="px-3">
                      <FaSearchPlus className="text-muted" />
                    </InputGroup.Text>
                  </InputGroup>
                </Form.Group>
              </Col>
              <Col md={2}>
                <div className="d-flex gap-2">
                  <Button
                    variant={isHeatmapMode ? "primary" : "outline-primary"}
                    size="sm"
                    onClick={() => setIsHeatmapMode(!isHeatmapMode)}
                    className="flex-fill"
                  >
                    <FaEye className="me-1" />
                    Heatmap
                  </Button>
                </div>
              </Col>
            </Row>
          </Card.Header>
        )}

        <Card.Body className="p-4">
          <div 
            className="word-cloud-container rounded-4 position-relative overflow-hidden"
            style={{
              minHeight: '500px',
              background: isDarkMode 
                ? `linear-gradient(135deg, #1f2937 0%, #374151 100%)`
                : isHeatmapMode 
                  ? 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)'
                  : `linear-gradient(135deg, ${themes[currentTheme].primary}15 0%, ${themes[currentTheme].secondary}10 50%, ${themes[currentTheme].accent}15 100%)`,
              border: `2px solid ${isDarkMode ? '#4b5563' : '#e2e8f0'}`,
              boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.05)'
            }}
          >
            <div 
              className="position-absolute w-100 h-100 opacity-10"
              style={{
                background: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23${themes[currentTheme].primary.slice(1)}' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />
            
            <div className="d-flex flex-wrap justify-content-center align-items-center p-4 position-relative">
              {wordCloudData.map((word, index) => {
                const colors = getWordColors(word, maxValue);
                const fontSize = getWordSize(word.value, maxValue);
                const isHovered = hoveredWord === word.text;
                
                return (
                  <span
                    key={`${word.text}-${index}`}
                    className="word-cloud-item position-relative d-inline-block m-2 user-select-none"
                    style={{
                      fontSize: `${fontSize}px`,
                      fontWeight: word.value > maxValue * 0.5 ? '900' : '700',
                      color: colors.text,
                      background: isHovered 
                        ? `linear-gradient(135deg, ${colors.bg}, ${colors.border})`
                        : colors.bg,
                      border: `2px solid ${colors.border}`,
                      borderRadius: '16px',
                      padding: `${Math.max(4, fontSize * 0.15)}px ${Math.max(8, fontSize * 0.25)}px`,
                      cursor: 'pointer',
                      transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
                      transformOrigin: 'center',
                      textShadow: isHeatmapMode && colors.text === '#ffffff' 
                        ? '0 1px 2px rgba(0, 0, 0, 0.5)' 
                        : isDarkMode 
                          ? '0 1px 2px rgba(0, 0, 0, 0.8)'
                          : '0 1px 2px rgba(0, 0, 0, 0.1)',
                      backdropFilter: 'blur(10px)',
                      WebkitBackdropFilter: 'blur(10px)',
                      transform: isHovered 
                        ? 'scale(1.3) translateZ(10px)' 
                        : 'scale(1) translateZ(0)',
                      zIndex: isHovered ? 100 : index,
                      boxShadow: isHovered
                        ? '0 20px 40px rgba(0, 0, 0, 0.2), 0 0 0 4px rgba(255, 255, 255, 0.8)'
                        : '0 2px 8px rgba(0, 0, 0, 0.1)',
                    }}
                    onClick={() => handleWordClick(word)}
                    onMouseEnter={() => setHoveredWord(word.text)}
                    onMouseLeave={() => setHoveredWord(null)}
                    title={isHeatmapMode 
                      ? `"${word.text}" - Frequency: ${word.value} (${((word.value/maxValue)*100).toFixed(1)}% of max)`
                      : `"${word.text}" appears ${word.value} times
Sentiment Score: ${word.sentimentScore}
Positive: ${word.positive} | Negative: ${word.negative} | Neutral: ${word.neutral}`}
                  >
                    {word.text}
                    
                    {isHovered && (
                      <div 
                        className="position-absolute bg-dark text-white px-3 py-2 rounded-3 small shadow-lg"
                        style={{
                          top: '-50px',
                          left: '50%',
                          transform: 'translateX(-50%)',
                          zIndex: 1000,
                          fontSize: '12px',
                          whiteSpace: 'nowrap',
                          boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)',
                          backdropFilter: 'blur(10px)'
                        }}
                      >
                        {isHeatmapMode 
                          ? `${word.value} freq • ${((word.value/maxValue)*100).toFixed(1)}%`
                          : `${word.value} occurrences • ${word.dominantSentiment}`}
                        <div 
                          className="position-absolute"
                          style={{
                            top: '100%',
                            left: '50%',
                            transform: 'translateX(-50%)',
                            width: 0,
                            height: 0,
                            borderLeft: '8px solid transparent',
                            borderRight: '8px solid transparent',
                            borderTop: '8px solid #1f2937'
                          }}
                        />
                      </div>
                    )}
                  </span>
                );
              })}
            </div>

            {wordCloudData.length === 0 && (
              <div className="position-absolute top-50 start-50 translate-middle text-center">
                <FaFilter size={48} className="text-muted opacity-50 mb-3" />
                <p className="text-muted">No words match your current filters</p>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={() => {
                    setSelectedSentiment('all');
                    setMinWordCount(1);
                    setSearchTerm('');
                  }}
                >
                  Reset Filters
                </Button>
              </div>
            )}
          </div>

          <div className={`d-flex justify-content-center align-items-center gap-4 my-4 p-3 rounded-3 ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
            {isHeatmapMode ? (
              <>
                <span className="fw-semibold small me-3">Frequency Intensity:</span>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle" style={{
                    width: '16px', 
                    height: '16px', 
                    background: 'hsla(240, 70%, 50%, 0.8)'
                  }}></div>
                  <span className="fw-semibold small text-primary">Low</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle" style={{
                    width: '16px', 
                    height: '16px', 
                    background: 'hsla(120, 85%, 50%, 0.9)'
                  }}></div>
                  <span className="fw-semibold small text-success">Medium</span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle" style={{
                    width: '16px', 
                    height: '16px', 
                    background: 'hsla(60, 100%, 50%, 1.0)'
                  }}></div>
                  <span className="fw-semibold small text-warning">High</span>
                </div>
              </>
            ) : (
              <>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle" style={{
                    width: '16px', 
                    height: '16px', 
                    background: getSentimentColor('positive', 0.8).bg
                  }}></div>
                  <span className="fw-semibold text-success small">
                    <FaThumbsUp className="me-1" />Positive
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle" style={{
                    width: '16px', 
                    height: '16px', 
                    background: getSentimentColor('negative', 0.8).bg
                  }}></div>
                  <span className="fw-semibold text-danger small">
                    <FaThumbsDown className="me-1" />Negative
                  </span>
                </div>
                <div className="d-flex align-items-center">
                  <div className="me-2 rounded-circle" style={{
                    width: '16px', 
                    height: '16px', 
                    background: getSentimentColor('neutral', 0.8).bg
                  }}></div>
                  <span className="fw-semibold text-warning small">
                    <FaMinus className="me-1" />Neutral
                  </span>
                </div>
              </>
            )}
          </div>
        </Card.Body>
      </Card>

      <Row className="g-4">
        <Col lg={4}>
          <Card className={`h-100 shadow-sm border-0 rounded-3 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Header className="bg-success text-white border-0 rounded-top-3">
              <h6 className="mb-0 fw-bold">
                <FaThumbsUp className="me-2" />
                Top Positive Keywords
              </h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-wrap gap-2">
                {wordCloudData
                  .filter(word => word.dominantSentiment === 'positive')
                  .slice(0, 12)
                  .map((word, index) => (
                    <Badge 
                      key={word.text}
                      bg="success" 
                      className="cursor-pointer px-3 py-2 fw-semibold"
                      style={{ 
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        opacity: 0.9
                      }}
                      onClick={() => handleWordClick(word)}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      {word.text} ({word.positive})
                    </Badge>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className={`h-100 shadow-sm border-0 rounded-3 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Header className="bg-danger text-white border-0 rounded-top-3">
              <h6 className="mb-0 fw-bold">
                <FaThumbsDown className="me-2" />
                Top Negative Keywords
              </h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-wrap gap-2">
                {wordCloudData
                  .filter(word => word.dominantSentiment === 'negative')
                  .slice(0, 12)
                  .map((word, index) => (
                    <Badge 
                      key={word.text}
                      bg="danger" 
                      className="cursor-pointer px-3 py-2 fw-semibold"
                      style={{ 
                        fontSize: '0.85rem',
                        transition: 'all 0.2s ease',
                        opacity: 0.9
                      }}
                      onClick={() => handleWordClick(word)}
                      onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                      onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                    >
                      {word.text} ({word.negative})
                    </Badge>
                  ))}
              </div>
            </Card.Body>
          </Card>
        </Col>

        <Col lg={4}>
          <Card className={`h-100 shadow-sm border-0 rounded-3 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Header className="bg-primary text-white border-0 rounded-top-3">
              <h6 className="mb-0 fw-bold">
                <FaChartLine className="me-2" />
                Most Frequent Overall
              </h6>
            </Card.Header>
            <Card.Body className="p-3">
              <div className="d-flex flex-wrap gap-2">
                {wordCloudData.slice(0, 12).map((word, index) => (
                  <Badge 
                    key={word.text}
                    bg="primary" 
                    className="cursor-pointer px-3 py-2 fw-semibold"
                    style={{ 
                      fontSize: '0.85rem',
                      transition: 'all 0.2s ease',
                      opacity: 0.9
                    }}
                    onClick={() => handleWordClick(word)}
                    onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                    onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
                  >
                    {word.text} ({word.value})
                  </Badge>
                ))}
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className={`shadow-sm border-0 rounded-3 mt-4 ${isDarkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Header className={`border-0 rounded-top-3 ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
          <h6 className="mb-0 fw-bold">
            <FaInfoCircle className="me-2" />
            Analytics Overview
          </h6>
        </Card.Header>
        <Card.Body>
          <Row className="text-center g-4">
            <Col md={3}>
              <div className={`p-3 rounded-3 ${isDarkMode ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'}`}>
                <h3 className="text-primary mb-2 fw-bold">{wordCloudData.length}</h3>
                <p className="text-muted mb-0 fw-semibold">Unique Keywords</p>
              </div>
            </Col>
            <Col md={3}>
              <div className={`p-3 rounded-3 ${isDarkMode ? 'bg-success bg-opacity-20' : 'bg-success bg-opacity-10'}`}>
                <h3 className="text-success mb-2 fw-bold">
                  {wordCloudData.filter(w => w.dominantSentiment === 'positive').length}
                </h3>
                <p className="text-muted mb-0 fw-semibold">Positive Terms</p>
              </div>
            </Col>
            <Col md={3}>
              <div className={`p-3 rounded-3 ${isDarkMode ? 'bg-danger bg-opacity-20' : 'bg-danger bg-opacity-10'}`}>
                <h3 className="text-danger mb-2 fw-bold">
                  {wordCloudData.filter(w => w.dominantSentiment === 'negative').length}
                </h3>
                <p className="text-muted mb-0 fw-semibold">Negative Terms</p>
              </div>
            </Col>
            <Col md={3}>
              <div className={`p-3 rounded-3 ${isDarkMode ? 'bg-warning bg-opacity-20' : 'bg-warning bg-opacity-10'}`}>
                <h3 className="text-warning mb-2 fw-bold">
                  {wordCloudData.filter(w => w.dominantSentiment === 'neutral').length}
                </h3>
                <p className="text-muted mb-0 fw-semibold">Neutral Terms</p>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className={`mt-4 border-0 rounded-3 ${isDarkMode ? 'bg-secondary' : 'bg-light'}`}>
        <Card.Body className="p-4 text-center">
          <div className="d-flex justify-content-center align-items-center gap-4 flex-wrap">
            <small className="text-muted fw-semibold">
              <FaSearchPlus className="me-1 text-primary" />
              Hover to see details
            </small>
            <small className="text-muted fw-semibold">
              <FaCloud className="me-1 text-success" />
              Click to analyze
            </small>
            <small className="text-muted fw-semibold">
              <FaChartLine className="me-1 text-warning" />
              Size shows frequency
            </small>
            <small className="text-muted fw-semibold">
              <FaFilter className="me-1 text-info" />
              Use filters to explore
            </small>
            <small className="text-muted fw-semibold">
              <FaEye className="me-1 text-secondary" />
              Toggle modes & views
            </small>
          </div>
        </Card.Body>
      </Card>

      <Modal show={exportModalShow} onHide={() => setExportModalShow(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>
            <FaDownload className="me-2" />
            Export Word Cloud
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-light' : ''}>
          <h6 className="mb-3">Export as Image</h6>
          <div className="d-flex gap-2 mb-4">
            <Button variant="outline-primary" onClick={() => exportAsImage('png')}>
              <FaFileImage className="me-1" />
              PNG Image
            </Button>
            <Button variant="outline-secondary" onClick={() => exportAsImage('pdf')}>
              <FaFilePdf className="me-1" />
              PDF Document
            </Button>
          </div>
          
          <h6 className="mb-3">Export Data</h6>
          <div className="d-flex gap-2">
            <Button variant="outline-info" onClick={() => exportData('json')}>
              <FaFileExport className="me-1" />
              JSON Data
            </Button>
            <Button variant="outline-success" onClick={() => exportData('csv')}>
              <FaFileExport className="me-1" />
              CSV Spreadsheet
            </Button>
          </div>
          
          <Alert variant="info" className="mt-3 small">
            <FaInfoCircle className="me-1" />
            High-resolution exports preserve all visual details and include metadata.
          </Alert>
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setExportModalShow(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      <style jsx>{`
        .dark-theme {
          color-scheme: dark;
        }
        
        .word-cloud-item {
          will-change: transform;
        }
        
        @media (max-width: 768px) {
          .word-cloud-container {
            min-height: 400px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default WordCloudComponent;
