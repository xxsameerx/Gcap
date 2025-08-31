import React, { useState, useMemo } from 'react';
import { Card, Table, Form, Row, Col, Button, Badge, InputGroup } from 'react-bootstrap';
import { FaSearch, FaFilter, FaDownload, FaSort, FaSortUp, FaSortDown } from 'react-icons/fa';

const DataTable = ({ data, onExport }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('');
  const [sortDirection, setSortDirection] = useState('asc');

  const filteredAndSortedData = useMemo(() => {
    if (!data || data.length === 0) return [];

    let filtered = data.filter(item => {
      const matchesSearch = !searchTerm || 
        (item.comment || item.feedback || item.text || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesSentiment = sentimentFilter === 'all' || 
        (item.sentiment === sentimentFilter);

      return matchesSearch && matchesSentiment;
    });

    // Sort data
    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField] || '';
        let bVal = b[sortField] || '';
        
        if (typeof aVal === 'string') aVal = aVal.toLowerCase();
        if (typeof bVal === 'string') bVal = bVal.toLowerCase();
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, sentimentFilter, sortField, sortDirection]);

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
    if (sortField !== field) return <FaSort className="text-muted" />;
    return sortDirection === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  const getSentimentBadge = (sentiment) => {
    const variants = {
      positive: 'success',
      negative: 'danger',
      neutral: 'warning'
    };
    return (
      <Badge bg={variants[sentiment] || 'secondary'}>
        {sentiment || 'Unknown'}
      </Badge>
    );
  };

  if (!data || data.length === 0) {
    return (
      <Card>
        <Card.Body className="text-center py-5">
          <p className="text-muted">No data available</p>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <Row className="align-items-center">
          <Col>
            <h5 className="mb-0">Comments Analysis</h5>
          </Col>
          <Col xs="auto">
            <Button variant="outline-primary" size="sm" onClick={onExport}>
              <FaDownload className="me-1" />
              Export
            </Button>
          </Col>
        </Row>
      </Card.Header>
      <Card.Body>
        {/* Filters */}
        <Row className="mb-3">
          <Col md={6}>
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
          <Col md={3} className="text-end">
            <small className="text-muted">
              Showing {filteredAndSortedData.length} of {data.length} comments
            </small>
          </Col>
        </Row>

        {/* Table */}
        <div className="table-responsive">
          <Table hover>
            <thead>
              <tr>
                <th 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleSort('comment')}
                  className="border-0"
                >
                  Comment {getSortIcon('comment')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleSort('sentiment')}
                  className="border-0"
                >
                  Sentiment {getSortIcon('sentiment')}
                </th>
                <th 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => handleSort('date')}
                  className="border-0"
                >
                  Date {getSortIcon('date')}
                </th>
                <th className="border-0">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map((item, index) => (
                <tr key={index}>
                  <td>
                    <div style={{ maxWidth: '400px' }}>
                      {(item.comment || item.feedback || item.text || 'N/A').substring(0, 150)}
                      {(item.comment || item.feedback || item.text || '').length > 150 && '...'}
                    </div>
                  </td>
                  <td>
                    {getSentimentBadge(item.sentiment)}
                  </td>
                  <td>
                    <small className="text-muted">
                      {item.date || new Date().toLocaleDateString()}
                    </small>
                  </td>
                  <td>
                    <Button variant="outline-primary" size="sm">
                      View Details
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <Row className="align-items-center mt-3">
            <Col>
              <small className="text-muted">
                Page {currentPage} of {totalPages}
              </small>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
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
