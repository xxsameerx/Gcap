import React, { useState, useMemo } from 'react';
import { Card, Table, Form, Row, Col, Button, Badge, InputGroup, ProgressBar } from 'react-bootstrap';
import { FaSearch, FaDownload, FaSort, FaSortUp, FaSortDown, FaEye, FaChartBar } from 'react-icons/fa';

const DataTable = ({ data, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  // Debug function to ensure safe rendering
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') {
      console.warn('Attempted to render object:', value);
      return JSON.stringify(value);
    }
    return String(value);
  };

  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    let filtered = data.filter(item => {
      if (!item || typeof item !== 'object') return false;
      
      const commentText = safeRender(item.comment || item.feedback || item.text || '');
      const matchesSearch = !searchTerm || commentText.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSentiment = sentimentFilter === 'all' || (item.sentiment === sentimentFilter);

      const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
      const matchesConfidence = confidenceFilter === 'all' || 
        (confidenceFilter === 'high' && confidence > 0.8) ||
        (confidenceFilter === 'medium' && confidence >= 0.5 && confidence <= 0.8) ||
        (confidenceFilter === 'low' && confidence < 0.5);

      return matchesSearch && matchesSentiment && matchesConfidence;
    });

    // Sort data safely
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        // Convert to string safely
        aVal = safeRender(aVal, '').toLowerCase();
        bVal = safeRender(bVal, '').toLowerCase();
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, sentimentFilter, confidenceFilter, sortField, sortDirection]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return <FaSort className="text-muted ms-1" />;
    return sortDirection === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  };

  const getSentimentBadge = (sentiment, confidence = 0) => {
    const sentimentStr = safeRender(sentiment, 'unknown');
    const variants = {
      positive: 'success',
      negative: 'danger',
      neutral: 'warning',
      unknown: 'secondary'
    };
    
    const confidenceNum = typeof confidence === 'number' ? confidence : 0;
    const opacity = confidenceNum > 0.8 ? '' : confidenceNum > 0.5 ? ' opacity-75' : ' opacity-50';
    
    return (
      <Badge bg={variants[sentimentStr.toLowerCase()] || 'secondary'} className={`px-2 py-1${opacity}`}>
        {sentimentStr.charAt(0).toUpperCase() + sentimentStr.slice(1)}
      </Badge>
    );
  };

  const getConfidenceColor = (confidence = 0) => {
    const confidenceNum = typeof confidence === 'number' ? confidence : 0;
    if (confidenceNum > 0.8) return 'success';
    if (confidenceNum > 0.5) return 'warning';
    return 'danger';
  };

  // Early return if no data
  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <FaChartBar size={48} className="text-muted mb-3" />
          <p className="text-muted">No data available</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card className="shadow-sm">
      <Card.Header className="bg-light">
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">
              <FaChartBar className="me-2" />
              Detailed Analysis Results
            </h5>
          </Col>
          <Col xs="auto">
            <Button variant="primary" size="sm" onClick={onExport}>
              <FaDownload className="me-1" />
              Export CSV
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {/* Filters */}
        <Row className="mb-4">
          <Col md={4}>
            <InputGroup>
              <InputGroup.Text>
                <FaSearch />
              </InputGroup.Text>
              <Form.Control
                type="text"
                placeholder="Search comments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Col>
          <Col md={3}>
            <Form.Select
              value={sentimentFilter}
              onChange={(e) => setSentimentFilter(e.target.value)}
            >
              <option value="all">All Sentiments</option>
              <option value="positive">Positive</option>
              <option value="negative">Negative</option>
              <option value="neutral">Neutral</option>
            </Form.Select>
          </Col>
          <Col md={3}>
            <Form.Select
              value={confidenceFilter}
              onChange={(e) => setConfidenceFilter(e.target.value)}
            >
              <option value="all">All Confidence</option>
              <option value="high">High (over 80%)</option>
              <option value="medium">Medium (50-80%)</option>
              <option value="low">Low (under 50%)</option>
            </Form.Select>
          </Col>
          <Col md={2} className="text-end">
            <small className="text-muted">
              {filteredAndSortedData.length} of {data.length}
            </small>
          </Col>
        </Row>

        {/* Table */}
        <div className="table-responsive">
          <Table hover className="align-middle">
            <thead className="table-light">
              <tr>
                <th 
                  style={{ cursor: 'pointer', minWidth: '300px' }} 
                  onClick={() => handleSort('comment')}
                  className="border-0"
                >
                  Comment {getSortIcon('comment')}
                </th>
                <th 
                  style={{ cursor: 'pointer', minWidth: '120px' }} 
                  onClick={() => handleSort('sentiment')}
                  className="border-0 text-center"
                >
                  Sentiment {getSortIcon('sentiment')}
                </th>
                <th 
                  style={{ cursor: 'pointer', minWidth: '150px' }} 
                  onClick={() => handleSort('confidence')}
                  className="border-0 text-center"
                >
                  Confidence {getSortIcon('confidence')}
                </th>
                <th 
                  style={{ cursor: 'pointer', minWidth: '120px' }} 
                  onClick={() => handleSort('date')}
                  className="border-0 text-center"
                >
                  Date {getSortIcon('date')}
                </th>
                <th className="border-0 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => {
                // Safely extract all values
                const commentText = safeRender(item.comment || item.feedback || item.text, 'No comment');
                const displayText = commentText.length > 150 ? commentText.substring(0, 150) + '...' : commentText;
                const sentiment = safeRender(item.sentiment, 'neutral');
                const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
                const dateValue = safeRender(item.date, 'N/A');
                const itemId = item.id || `item-${index}`;
                
                return (
                  <tr key={itemId} className="border-bottom">
                    <td>
                      <div style={{ maxWidth: '400px' }}>
                        <p className="mb-1 fw-medium">
                          {displayText}
                        </p>
                        {item.probabilities && typeof item.probabilities === 'object' && (
                          <div className="mt-2">
                            <small className="text-muted d-block mb-1">Probability breakdown:</small>
                            <div className="d-flex gap-2">
                              <Badge bg="success" className="opacity-75">
                                P: {((item.probabilities.Positive || 0) * 100).toFixed(0)}%
                              </Badge>
                              <Badge bg="danger" className="opacity-75">
                                N: {((item.probabilities.Negative || 0) * 100).toFixed(0)}%
                              </Badge>
                              <Badge bg="warning" className="opacity-75">
                                Neu: {((item.probabilities.Neutral || 0) * 100).toFixed(0)}%
                              </Badge>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="text-center">
                      {getSentimentBadge(sentiment, confidence)}
                    </td>
                    <td className="text-center">
                      <div className="d-flex flex-column align-items-center">
                        <div className="mb-2" style={{ width: '80px' }}>
                          <ProgressBar 
                            variant={getConfidenceColor(confidence)}
                            now={confidence * 100} 
                            style={{ height: '8px' }}
                          />
                        </div>
                        <Badge bg={getConfidenceColor(confidence)} className="px-2">
                          {(confidence * 100).toFixed(1)}%
                        </Badge>
                      </div>
                    </td>
                    <td className="text-center">
                      <small className="text-muted">
                        {dateValue}
                      </small>
                    </td>
                    <td className="text-center">
                      <Button 
                        variant="outline-primary" 
                        size="sm"
                        title="View detailed analysis"
                      >
                        <FaEye />
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Row className="align-items-center mt-4 pt-3 border-top">
            <Col sm={6}>
              <small className="text-muted">
                Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
                {filteredAndSortedData.length} results
              </small>
            </Col>
            <Col sm={6}>
              <div className="d-flex justify-content-end gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="px-3 py-1 bg-light rounded small">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default DataTable;
