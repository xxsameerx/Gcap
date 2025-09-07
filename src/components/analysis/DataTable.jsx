// import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
// import { 
//   Card, Table, Form, Row, Col, Button, Badge, InputGroup, 
//   ProgressBar, Modal, Alert, Dropdown, OverlayTrigger, Tooltip,
//   ButtonGroup, Container, Spinner
// } from 'react-bootstrap';
// import { 
//   FaSearch, FaDownload, FaSort, FaSortUp, FaSortDown, FaEye, FaChartBar,
//   FaTrash, FaStar, FaTags, FaFileExport, FaColumns, FaExpand, FaCompress,
//   FaEdit, FaCheck, FaTimes, FaFilter, FaCalendarAlt, FaChevronDown, FaChevronRight,
//   FaMobile, FaPrint, FaCode, FaCog, FaPlus, FaCheckSquare, FaSquare  // ✅ FIXED: Changed FaRegularExpression to FaCode
// } from 'react-icons/fa';

// const EnhancedDataTable = ({ data = [], onExport, title = "Advanced Data Analysis" }) => {
//   // 🎯 Core State Management
//   const [searchTerm, setSearchTerm] = useState('');
//   const [regexEnabled, setRegexEnabled] = useState(false);
//   const [sentimentFilter, setSentimentFilter] = useState('all');
//   const [confidenceFilter, setConfidenceFilter] = useState('all');
//   const [dateRange, setDateRange] = useState({ start: '', end: '' });
//   const [currentPage, setCurrentPage] = useState(1);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [sortField, setSortField] = useState('date');
//   const [sortDirection, setSortDirection] = useState('desc');
  
//   // 🔄 Advanced Features State
//   const [selectedItems, setSelectedItems] = useState(new Set());
//   const [expandedRows, setExpandedRows] = useState(new Set());
//   const [annotations, setAnnotations] = useState({});
//   const [favorites, setFavorites] = useState(new Set());
//   const [tags, setTags] = useState({});
//   const [columnVisibility, setColumnVisibility] = useState({
//     comment: true, sentiment: true, confidence: true, date: true, actions: true
//   });
//   const [pinnedColumns, setPinnedColumns] = useState(new Set(['comment']));
  
//   // 📊 UI State
//   const [showAnnotationModal, setShowAnnotationModal] = useState(false);
//   const [showExportModal, setShowExportModal] = useState(false);
//   const [showColumnManager, setShowColumnManager] = useState(false);
//   const [modalData, setModalData] = useState({ id: null, text: '', type: 'annotation' });
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  
//   // 📈 Performance & Analytics
//   const [loading, setLoading] = useState(false);
//   const [pageStats, setPageStats] = useState({});
//   const searchTimeoutRef = useRef(null);

//   // 🛠️ Utility Functions
//   const safeRender = useCallback((value, fallback = 'N/A') => {
//     if (value === null || value === undefined) return fallback;
//     if (typeof value === 'object') return JSON.stringify(value);
//     return String(value);
//   }, []);

//   // 🔍 Advanced Search with Regex & Debouncing
//   const performSearch = useCallback((term) => {
//     if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
//     searchTimeoutRef.current = setTimeout(() => {
//       setSearchTerm(term);
//       setCurrentPage(1);
//     }, 300);
//   }, []);

//   // 📊 1. Smart Summary Cards & Real-time Statistics
//   const summaryStats = useMemo(() => {
//     if (!Array.isArray(data) || data.length === 0) return {};
    
//     const stats = {
//       total: data.length,
//       positive: data.filter(item => item.sentiment === 'positive').length,
//       negative: data.filter(item => item.sentiment === 'negative').length,
//       neutral: data.filter(item => item.sentiment === 'neutral').length,
//       avgConfidence: data.reduce((sum, item) => sum + (item.confidence || 0), 0) / data.length,
//       highConfidence: data.filter(item => (item.confidence || 0) > 0.8).length,
//       recentComments: data.filter(item => {
//         const itemDate = new Date(item.date);
//         const weekAgo = new Date();
//         weekAgo.setDate(weekAgo.getDate() - 7);
//         return itemDate > weekAgo;
//       }).length
//     };
    
//     stats.sentimentScore = ((stats.positive - stats.negative) / stats.total * 100).toFixed(1);
//     return stats;
//   }, [data]);

//   // 🎨 2. Advanced Filtering & Search Logic
//   const filteredAndSortedData = useMemo(() => {
//     if (!Array.isArray(data) || data.length === 0) return [];

//     let filtered = data.filter(item => {
//       if (!item || typeof item !== 'object') return false;
      
//       // Advanced search with regex support
//       const commentText = safeRender(item.comment || item.feedback || item.text || '');
//       let matchesSearch = true;
      
//       if (searchTerm) {
//         if (regexEnabled) {
//           try {
//             const regex = new RegExp(searchTerm, 'i');
//             matchesSearch = regex.test(commentText);
//           } catch {
//             matchesSearch = commentText.toLowerCase().includes(searchTerm.toLowerCase());
//           }
//         } else {
//           matchesSearch = commentText.toLowerCase().includes(searchTerm.toLowerCase());
//         }
//       }
      
//       // Sentiment filter
//       const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
      
//       // Confidence filter
//       const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
//       const matchesConfidence = confidenceFilter === 'all' || 
//         (confidenceFilter === 'high' && confidence > 0.8) ||
//         (confidenceFilter === 'medium' && confidence >= 0.5 && confidence <= 0.8) ||
//         (confidenceFilter === 'low' && confidence < 0.5);
      
//       // Date range filter
//       let matchesDate = true;
//       if (dateRange.start || dateRange.end) {
//         const itemDate = new Date(item.date);
//         if (dateRange.start && itemDate < new Date(dateRange.start)) matchesDate = false;
//         if (dateRange.end && itemDate > new Date(dateRange.end)) matchesDate = false;
//       }

//       return matchesSearch && matchesSentiment && matchesConfidence && matchesDate;
//     });

//     // Advanced sorting
//     if (sortField) {
//       filtered.sort((a, b) => {
//         let aVal = a[sortField];
//         let bVal = b[sortField];
        
//         if (sortField === 'confidence') {
//           aVal = aVal || 0;
//           bVal = bVal || 0;
//         } else if (sortField === 'date') {
//           aVal = new Date(aVal);
//           bVal = new Date(bVal);
//         } else {
//           aVal = safeRender(aVal, '').toLowerCase();
//           bVal = safeRender(bVal, '').toLowerCase();
//         }
        
//         if (sortDirection === 'asc') {
//           return aVal > bVal ? 1 : -1;
//         } else {
//           return aVal < bVal ? 1 : -1;
//         }
//       });
//     }

//     return filtered;
//   }, [data, searchTerm, regexEnabled, sentimentFilter, confidenceFilter, dateRange, sortField, sortDirection, safeRender]);

//   // 📄 3. Enhanced Pagination
//   const paginatedData = useMemo(() => {
//     const startIndex = (currentPage - 1) * itemsPerPage;
//     return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
//   }, [filteredAndSortedData, currentPage, itemsPerPage]);

//   const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

//   // 🎯 4. Event Handlers
//   const handleSort = useCallback((field) => {
//     if (sortField === field) {
//       setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
//     } else {
//       setSortField(field);
//       setSortDirection('asc');
//     }
//   }, [sortField]);

//   const handleSelectAll = useCallback(() => {
//     if (selectedItems.size === paginatedData.length) {
//       setSelectedItems(new Set());
//     } else {
//       setSelectedItems(new Set(paginatedData.map((item, index) => item.id || index)));
//     }
//   }, [selectedItems.size, paginatedData]);

//   const handleSelectItem = useCallback((id) => {
//     const newSelected = new Set(selectedItems);
//     if (newSelected.has(id)) {
//       newSelected.delete(id);
//     } else {
//       newSelected.add(id);
//     }
//     setSelectedItems(newSelected);
//   }, [selectedItems]);

//   const handleBulkAction = useCallback((action) => {
//     const selectedData = paginatedData.filter((item, index) => 
//       selectedItems.has(item.id || index)
//     );
    
//     switch (action) {
//       case 'delete':
//         console.log('Bulk delete:', selectedData);
//         break;
//       case 'favorite':
//         selectedData.forEach(item => {
//           const id = item.id || item.comment?.substring(0, 10);
//           setFavorites(prev => new Set([...prev, id]));
//         });
//         break;
//       case 'export':
//         exportData('csv', selectedData);
//         break;
//     }
    
//     setSelectedItems(new Set());
//   }, [selectedItems, paginatedData]);

//   const handleAnnotation = useCallback((id, text, type = 'annotation') => {
//     if (type === 'annotation') {
//       setAnnotations(prev => ({ ...prev, [id]: text }));
//     } else if (type === 'tag') {
//       setTags(prev => ({ ...prev, [id]: text }));
//     }
//     setShowAnnotationModal(false);
//     setModalData({ id: null, text: '', type: 'annotation' });
//   }, []);

//   // 📊 5. Export Functions with Multiple Formats
//   const exportData = useCallback((format, dataToExport = filteredAndSortedData) => {
//     const exportData = {
//       metadata: {
//         title,
//         exportDate: new Date().toISOString(),
//         totalItems: dataToExport.length,
//         filters: { sentimentFilter, confidenceFilter, searchTerm },
//         summary: summaryStats
//       },
//       data: dataToExport.map((item, index) => ({
//         id: item.id || index,
//         comment: safeRender(item.comment || item.feedback || item.text),
//         sentiment: item.sentiment,
//         confidence: item.confidence,
//         date: item.date,
//         annotation: annotations[item.id] || '',
//         tags: tags[item.id] || '',
//         isFavorite: favorites.has(item.id || item.comment?.substring(0, 10))
//       }))
//     };

//     const timestamp = new Date().toISOString().split('T')[0];
    
//     switch (format) {
//       case 'csv':
//         const csvContent = convertToCSV(exportData.data);
//         downloadFile(csvContent, `${title}-${timestamp}.csv`, 'text/csv');
//         break;
//       case 'json':
//         downloadFile(JSON.stringify(exportData, null, 2), `${title}-${timestamp}.json`, 'application/json');
//         break;
//       case 'excel':
//         // Would integrate with xlsx library
//         console.log('Excel export:', exportData);
//         break;
//     }
//   }, [filteredAndSortedData, title, sentimentFilter, confidenceFilter, searchTerm, summaryStats, annotations, tags, favorites, safeRender]);

//   const convertToCSV = useCallback((data) => {
//     if (!data.length) return '';
//     const headers = Object.keys(data[0]);
//     const csvContent = [
//       headers.join(','),
//       ...data.map(row => headers.map(header => 
//         JSON.stringify(row[header] || '')
//       ).join(','))
//     ].join('\n');
//     return csvContent;
//   }, []);

//   const downloadFile = useCallback((content, filename, mimeType) => {
//     const blob = new Blob([content], { type: mimeType });
//     const url = URL.createObjectURL(blob);
//     const link = document.createElement('a');
//     link.href = url;
//     link.download = filename;
//     link.click();
//     URL.revokeObjectURL(url);
//   }, []);

//   // 🎨 6. Component Renderers
//   const getSentimentBadge = useCallback((sentiment, confidence = 0) => {
//     const sentimentStr = safeRender(sentiment, 'unknown');
//     const variants = {
//       positive: 'success',
//       negative: 'danger', 
//       neutral: 'warning',
//       unknown: 'secondary'
//     };
    
//     const confidenceNum = typeof confidence === 'number' ? confidence : 0;
//     const opacity = confidenceNum > 0.8 ? '' : confidenceNum > 0.5 ? ' opacity-75' : ' opacity-50';
    
//     return (
//       <Badge bg={variants[sentimentStr.toLowerCase()] || 'secondary'} className={`px-2 py-1${opacity}`}>
//         {sentimentStr.charAt(0).toUpperCase() + sentimentStr.slice(1)}
//       </Badge>
//     );
//   }, [safeRender]);

//   const getSortIcon = useCallback((field) => {
//     if (sortField !== field) return <FaSort className="text-muted ms-1" />;
//     return sortDirection === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
//   }, [sortField, sortDirection]);

//   const getConfidenceColor = useCallback((confidence = 0) => {
//     const confidenceNum = typeof confidence === 'number' ? confidence : 0;
//     if (confidenceNum > 0.8) return 'success';
//     if (confidenceNum > 0.5) return 'warning';
//     return 'danger';
//   }, []);

//   // 📱 7. Responsive Design Handler
//   useEffect(() => {
//     const handleResize = () => {
//       setIsMobileView(window.innerWidth < 768);
//     };
    
//     window.addEventListener('resize', handleResize);
//     return () => window.removeEventListener('resize', handleResize);
//   }, []);

//   if (!Array.isArray(data) || data.length === 0) {
//     return (
//       <Card className={isDarkMode ? 'bg-dark text-light' : ''}>
//         <Card.Body className="text-center py-5">
//           <FaChartBar size={48} className="text-muted mb-3" />
//           <h5 className="text-muted">No Data Available</h5>
//           <p className="text-muted">Upload or provide data to see detailed analysis</p>
//         </Card.Body>
//       </Card>
//     );
//   }

//   return (
//     <div className={`enhanced-data-table ${isDarkMode ? 'dark-theme' : ''}`}>
//       {/* 📊 1. Smart Summary Dashboard */}
//       <Row className="mb-4">
//         <Col md={3}>
//           <Card className={`h-100 shadow-sm ${isDarkMode ? 'bg-dark text-light' : ''}`}>
//             <Card.Body className="text-center">
//               <h3 className="text-primary mb-2">{summaryStats.total}</h3>
//               <p className="text-muted mb-0">Total Comments</p>
//               <small className="text-success">+{summaryStats.recentComments} this week</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className={`h-100 shadow-sm ${isDarkMode ? 'bg-dark text-light' : ''}`}>
//             <Card.Body className="text-center">
//               <h3 className={`mb-2 ${summaryStats.sentimentScore > 0 ? 'text-success' : 'text-danger'}`}>
//                 {summaryStats.sentimentScore}%
//               </h3>
//               <p className="text-muted mb-0">Sentiment Score</p>
//               <small className="text-info">{summaryStats.positive}+ / {summaryStats.negative}-</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className={`h-100 shadow-sm ${isDarkMode ? 'bg-dark text-light' : ''}`}>
//             <Card.Body className="text-center">
//               <h3 className="text-warning mb-2">{(summaryStats.avgConfidence * 100).toFixed(1)}%</h3>
//               <p className="text-muted mb-0">Avg Confidence</p>
//               <small className="text-success">{summaryStats.highConfidence} high confidence</small>
//             </Card.Body>
//           </Card>
//         </Col>
//         <Col md={3}>
//           <Card className={`h-100 shadow-sm ${isDarkMode ? 'bg-dark text-light' : ''}`}>
//             <Card.Body className="text-center">
//               <h3 className="text-info mb-2">{selectedItems.size}</h3>
//               <p className="text-muted mb-0">Selected Items</p>
//               <small className="text-muted">{favorites.size} favorites</small>
//             </Card.Body>
//           </Card>
//         </Col>
//       </Row>

//       {/* 🎯 Main Data Table */}
//       <Card className={`shadow-sm ${isDarkMode ? 'bg-dark text-light' : ''}`}>
//         <Card.Header className={isDarkMode ? 'bg-secondary' : 'bg-light'}>
//           <Row className="align-items-center">
//             <Col>
//               <h5 className="mb-0">
//                 <FaChartBar className="me-2" />
//                 {title}
//                 <Badge bg="info" className="ms-2">{filteredAndSortedData.length}</Badge>
//               </h5>
//             </Col>
//             <Col xs="auto">
//               <ButtonGroup size="sm">
//                 <Button 
//                   variant={isDarkMode ? "warning" : "outline-secondary"}
//                   onClick={() => setIsDarkMode(!isDarkMode)}
//                 >
//                   {isDarkMode ? '☀️' : '🌙'}
//                 </Button>
//                 <Button 
//                   variant="outline-primary"
//                   onClick={() => setShowColumnManager(true)}
//                 >
//                   <FaColumns />
//                 </Button>
//                 <Button 
//                   variant="primary"
//                   onClick={() => setShowExportModal(true)}
//                 >
//                   <FaDownload className="me-1" />
//                   Export
//                 </Button>
//               </ButtonGroup>
//             </Col>
//           </Row>
//         </Card.Header>

//         <Card.Body>
//           {/* 🔍 Advanced Filters & Search */}
//           <Row className="mb-4">
//             <Col md={4}>
//               <InputGroup>
//                 <InputGroup.Text>
//                   <FaSearch />
//                 </InputGroup.Text>
//                 <Form.Control
//                   type="text"
//                   placeholder="Advanced search with regex..."
//                   onChange={(e) => performSearch(e.target.value)}
//                 />
//                 <Button 
//                   variant={regexEnabled ? "success" : "outline-secondary"}
//                   onClick={() => setRegexEnabled(!regexEnabled)}
//                   title="Enable Regex"
//                 >
//                   <FaCode />  {/* ✅ FIXED: Changed from FaRegularExpression to FaCode */}
//                 </Button>
//               </InputGroup>
//             </Col>
//             <Col md={2}>
//               <Form.Select
//                 value={sentimentFilter}
//                 onChange={(e) => setSentimentFilter(e.target.value)}
//               >
//                 <option value="all">All Sentiments</option>
//                 <option value="positive">Positive</option>
//                 <option value="negative">Negative</option>
//                 <option value="neutral">Neutral</option>
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <Form.Select
//                 value={confidenceFilter}
//                 onChange={(e) => setConfidenceFilter(e.target.value)}
//               >
//                 <option value="all">All Confidence</option>
//                 <option value="high">High (80%+)</option>
//                 <option value="medium">Medium (50-80%)</option>
//                 <option value="low">Low (&lt;50%)</option>  {/* ✅ FIXED: Changed < to &lt; */}
//               </Form.Select>
//             </Col>
//             <Col md={2}>
//               <Form.Control
//                 type="date"
//                 value={dateRange.start}
//                 onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
//                 placeholder="Start Date"
//               />
//             </Col>
//             <Col md={2}>
//               <Form.Control
//                 type="date"
//                 value={dateRange.end}
//                 onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
//                 placeholder="End Date"
//               />
//             </Col>
//           </Row>

//           {/* 🔄 Bulk Actions */}
//           {selectedItems.size > 0 && (
//             <Alert variant="info" className="d-flex justify-content-between align-items-center">
//               <span>{selectedItems.size} items selected</span>
//               <ButtonGroup size="sm">
//                 <Button variant="outline-danger" onClick={() => handleBulkAction('delete')}>
//                   <FaTrash className="me-1" />Delete
//                 </Button>
//                 <Button variant="outline-warning" onClick={() => handleBulkAction('favorite')}>
//                   <FaStar className="me-1" />Favorite
//                 </Button>
//                 <Button variant="outline-success" onClick={() => handleBulkAction('export')}>
//                   <FaFileExport className="me-1" />Export Selected
//                 </Button>
//               </ButtonGroup>
//             </Alert>
//           )}

//           {/* 📊 Enhanced Table */}
//           <div className="table-responsive">
//             <Table hover className={`align-middle ${isDarkMode ? 'table-dark' : ''}`}>
//               <thead className={isDarkMode ? 'table-secondary' : 'table-light'}>
//                 <tr>
//                   <th className="border-0" style={{ width: '50px' }}>
//                     <Form.Check
//                       type="checkbox"
//                       checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
//                       onChange={handleSelectAll}
//                     />
//                   </th>
//                   {columnVisibility.comment && (
//                     <th 
//                       style={{ cursor: 'pointer', minWidth: '300px' }} 
//                       onClick={() => handleSort('comment')}
//                       className="border-0"
//                     >
//                       Comment {getSortIcon('comment')}
//                     </th>
//                   )}
//                   {columnVisibility.sentiment && (
//                     <th 
//                       style={{ cursor: 'pointer', minWidth: '120px' }} 
//                       onClick={() => handleSort('sentiment')}
//                       className="border-0 text-center"
//                     >
//                       Sentiment {getSortIcon('sentiment')}
//                     </th>
//                   )}
//                   {columnVisibility.confidence && (
//                     <th 
//                       style={{ cursor: 'pointer', minWidth: '150px' }} 
//                       onClick={() => handleSort('confidence')}
//                       className="border-0 text-center"
//                     >
//                       Confidence {getSortIcon('confidence')}
//                     </th>
//                   )}
//                   {columnVisibility.date && (
//                     <th 
//                       style={{ cursor: 'pointer', minWidth: '120px' }} 
//                       onClick={() => handleSort('date')}
//                       className="border-0 text-center"
//                     >
//                       Date {getSortIcon('date')}
//                     </th>
//                   )}
//                   {columnVisibility.actions && (
//                     <th className="border-0 text-center" style={{ minWidth: '180px' }}>Actions</th>
//                   )}
//                 </tr>
//               </thead>
//               <tbody>
//                 {paginatedData.map((item, index) => {
//                   const itemId = item.id || index;
//                   const commentText = safeRender(item.comment || item.feedback || item.text, 'No comment');
//                   const isExpanded = expandedRows.has(itemId);
//                   const isSelected = selectedItems.has(itemId);
//                   const isFavorited = favorites.has(itemId);
                  
//                   return (
//                     <React.Fragment key={itemId}>
//                       <tr 
//                         className={`border-bottom ${isSelected ? (isDarkMode ? 'table-active' : 'table-primary') : ''}`}
//                         style={{
//                           backgroundColor: item.sentiment === 'positive' ? 'rgba(25, 135, 84, 0.1)' :
//                                          item.sentiment === 'negative' ? 'rgba(220, 53, 69, 0.1)' :
//                                          item.sentiment === 'neutral' ? 'rgba(255, 193, 7, 0.1)' : 'transparent'
//                         }}
//                       >
//                         <td>
//                           <div className="d-flex align-items-center">
//                             <Form.Check
//                               type="checkbox"
//                               checked={isSelected}
//                               onChange={() => handleSelectItem(itemId)}
//                               className="me-2"
//                             />
//                             <Button
//                               variant="link"
//                               size="sm"
//                               onClick={() => {
//                                 const newExpanded = new Set(expandedRows);
//                                 if (isExpanded) {
//                                   newExpanded.delete(itemId);
//                                 } else {
//                                   newExpanded.add(itemId);
//                                 }
//                                 setExpandedRows(newExpanded);
//                               }}
//                               className="p-0"
//                             >
//                               {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
//                             </Button>
//                           </div>
//                         </td>
                        
//                         {columnVisibility.comment && (
//                           <td>
//                             <div style={{ maxWidth: '400px' }}>
//                               <p className="mb-1 fw-medium">
//                                 {commentText.length > 150 ? commentText.substring(0, 150) + '...' : commentText}
//                                 {isFavorited && <FaStar className="text-warning ms-2" />}
//                               </p>
//                               {item.probabilities && (
//                                 <div className="mt-2">
//                                   <small className="text-muted d-block mb-1">Probability breakdown:</small>
//                                   <div className="d-flex gap-2">
//                                     <Badge bg="success" className="opacity-75">
//                                       P: {((item.probabilities.Positive || 0) * 100).toFixed(0)}%
//                                     </Badge>
//                                     <Badge bg="danger" className="opacity-75">
//                                       N: {((item.probabilities.Negative || 0) * 100).toFixed(0)}%
//                                     </Badge>
//                                     <Badge bg="warning" className="opacity-75">
//                                       Neu: {((item.probabilities.Neutral || 0) * 100).toFixed(0)}%
//                                     </Badge>
//                                   </div>
//                                 </div>
//                               )}
//                               {annotations[itemId] && (
//                                 <Alert variant="info" className="mt-2 mb-0 small">
//                                   <strong>Note:</strong> {annotations[itemId]}
//                                 </Alert>
//                               )}
//                               {tags[itemId] && (
//                                 <div className="mt-1">
//                                   <Badge bg="secondary" className="me-1">
//                                     <FaTags className="me-1" />{tags[itemId]}
//                                   </Badge>
//                                 </div>
//                               )}
//                             </div>
//                           </td>
//                         )}
                        
//                         {columnVisibility.sentiment && (
//                           <td className="text-center">
//                             {getSentimentBadge(item.sentiment, item.confidence)}
//                           </td>
//                         )}
                        
//                         {columnVisibility.confidence && (
//                           <td className="text-center">
//                             <div className="d-flex flex-column align-items-center">
//                               <div className="mb-2" style={{ width: '80px' }}>
//                                 <ProgressBar 
//                                   variant={getConfidenceColor(item.confidence)}
//                                   now={(item.confidence || 0) * 100} 
//                                   style={{ height: '8px' }}
//                                 />
//                               </div>
//                               <Badge bg={getConfidenceColor(item.confidence)} className="px-2">
//                                 {((item.confidence || 0) * 100).toFixed(1)}%
//                               </Badge>
//                             </div>
//                           </td>
//                         )}
                        
//                         {columnVisibility.date && (
//                           <td className="text-center">
//                             <small className="text-muted">
//                               {safeRender(item.date)}
//                             </small>
//                           </td>
//                         )}
                        
//                         {columnVisibility.actions && (
//                           <td className="text-center">
//                             <ButtonGroup size="sm">
//                               <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
//                                 <Button variant="outline-primary">
//                                   <FaEye />
//                                 </Button>
//                               </OverlayTrigger>
//                               <OverlayTrigger overlay={<Tooltip>Add Note</Tooltip>}>
//                                 <Button 
//                                   variant="outline-secondary"
//                                   onClick={() => {
//                                     setModalData({ id: itemId, text: annotations[itemId] || '', type: 'annotation' });
//                                     setShowAnnotationModal(true);
//                                   }}
//                                 >
//                                   <FaEdit />
//                                 </Button>
//                               </OverlayTrigger>
//                               <OverlayTrigger overlay={<Tooltip>Add to Favorites</Tooltip>}>
//                                 <Button 
//                                   variant={isFavorited ? "warning" : "outline-warning"}
//                                   onClick={() => {
//                                     const newFavorites = new Set(favorites);
//                                     if (isFavorited) {
//                                       newFavorites.delete(itemId);
//                                     } else {
//                                       newFavorites.add(itemId);
//                                     }
//                                     setFavorites(newFavorites);
//                                   }}
//                                 >
//                                   <FaStar />
//                                 </Button>
//                               </OverlayTrigger>
//                               <OverlayTrigger overlay={<Tooltip>Add Tag</Tooltip>}>
//                                 <Button 
//                                   variant="outline-info"
//                                   onClick={() => {
//                                     setModalData({ id: itemId, text: tags[itemId] || '', type: 'tag' });
//                                     setShowAnnotationModal(true);
//                                   }}
//                                 >
//                                   <FaTags />
//                                 </Button>
//                               </OverlayTrigger>
//                             </ButtonGroup>
//                           </td>
//                         )}
//                       </tr>
                      
//                       {/* 📖 Expandable Row Details */}
//                       {isExpanded && (
//                         <tr>
//                           <td colSpan={Object.values(columnVisibility).filter(Boolean).length + 1}>
//                             <Card className="m-2">
//                               <Card.Header>
//                                 <h6 className="mb-0">Detailed Analysis</h6>
//                               </Card.Header>
//                               <Card.Body>
//                                 <Row>
//                                   <Col md={6}>
//                                     <h6>Full Comment:</h6>
//                                     <p className="border p-2 rounded">{commentText}</p>
//                                   </Col>
//                                   <Col md={6}>
//                                     <h6>Analysis Breakdown:</h6>
//                                     <ul>
//                                       <li><strong>Sentiment:</strong> {item.sentiment}</li>
//                                       <li><strong>Confidence:</strong> {((item.confidence || 0) * 100).toFixed(2)}%</li>
//                                       <li><strong>Date:</strong> {item.date}</li>
//                                       <li><strong>Length:</strong> {commentText.length} characters</li>
//                                     </ul>
//                                     {item.keywords && (
//                                       <div>
//                                         <h6>Keywords:</h6>
//                                         <div className="d-flex flex-wrap gap-1">
//                                           {item.keywords.map((keyword, idx) => (
//                                             <Badge key={idx} bg="light" text="dark">{keyword}</Badge>
//                                           ))}
//                                         </div>
//                                       </div>
//                                     )}
//                                   </Col>
//                                 </Row>
//                               </Card.Body>
//                             </Card>
//                           </td>
//                         </tr>
//                       )}
//                     </React.Fragment>
//                   );
//                 })}
//               </tbody>
//             </Table>
//           </div>

//           {/* 📄 Enhanced Pagination */}
//           <Row className="align-items-center mt-4 pt-3 border-top">
//             <Col sm={6}>
//               <div className="d-flex align-items-center gap-2">
//                 <small className="text-muted">Show:</small>
//                 <Form.Select 
//                   size="sm" 
//                   style={{ width: 'auto' }}
//                   value={itemsPerPage}
//                   onChange={(e) => {
//                     setItemsPerPage(Number(e.target.value));
//                     setCurrentPage(1);
//                   }}
//                 >
//                   <option value={5}>5</option>
//                   <option value={10}>10</option>
//                   <option value={25}>25</option>
//                   <option value={50}>50</option>
//                   <option value={100}>100</option>
//                 </Form.Select>
//                 <small className="text-muted">
//                   Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
//                   {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
//                   {filteredAndSortedData.length} results
//                 </small>
//               </div>
//             </Col>
//             <Col sm={6}>
//               <div className="d-flex justify-content-end align-items-center gap-2">
//                 <Button
//                   variant="outline-secondary"
//                   size="sm"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(1)}
//                 >
//                   First
//                 </Button>
//                 <Button
//                   variant="outline-secondary"
//                   size="sm"
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage(currentPage - 1)}
//                 >
//                   Previous
//                 </Button>
//                 <Form.Control
//                   type="number"
//                   size="sm"
//                   style={{ width: '60px' }}
//                   value={currentPage}
//                   onChange={(e) => {
//                     const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
//                     setCurrentPage(page);
//                   }}
//                   min={1}
//                   max={totalPages}
//                 />
//                 <span className="small text-muted">of {totalPages}</span>
//                 <Button
//                   variant="outline-secondary"
//                   size="sm"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(currentPage + 1)}
//                 >
//                   Next
//                 </Button>
//                 <Button
//                   variant="outline-secondary"
//                   size="sm"
//                   disabled={currentPage === totalPages}
//                   onClick={() => setCurrentPage(totalPages)}
//                 >
//                   Last
//                 </Button>
//               </div>
//             </Col>
//           </Row>
//         </Card.Body>
//       </Card>

//       {/* 📝 Annotation Modal */}
//       <Modal show={showAnnotationModal} onHide={() => setShowAnnotationModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>
//             {modalData.type === 'annotation' ? 'Add Note' : 'Add Tag'}
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <Form.Control
//             as="textarea"
//             rows={3}
//             value={modalData.text}
//             onChange={(e) => setModalData(prev => ({ ...prev, text: e.target.value }))}
//             placeholder={modalData.type === 'annotation' ? 'Enter your note...' : 'Enter tag name...'}
//           />
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowAnnotationModal(false)}>
//             Cancel
//           </Button>
//           <Button 
//             variant="primary" 
//             onClick={() => handleAnnotation(modalData.id, modalData.text, modalData.type)}
//           >
//             Save {modalData.type === 'annotation' ? 'Note' : 'Tag'}
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* 📊 Export Modal */}
//       <Modal show={showExportModal} onHide={() => setShowExportModal(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Export Data</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h6>Export Format:</h6>
//           <div className="d-flex gap-2 mb-4">
//             <Button variant="outline-success" onClick={() => { exportData('csv'); setShowExportModal(false); }}>
//               <FaFileExport className="me-1" />CSV
//             </Button>
//             <Button variant="outline-info" onClick={() => { exportData('json'); setShowExportModal(false); }}>
//               <FaFileExport className="me-1" />JSON
//             </Button>
//             <Button variant="outline-warning" onClick={() => { exportData('excel'); setShowExportModal(false); }}>
//               <FaFileExport className="me-1" />Excel
//             </Button>
//           </div>
//           <Alert variant="info">
//             <small>
//               Export includes: {filteredAndSortedData.length} items, annotations, tags, and metadata.
//             </small>
//           </Alert>
//         </Modal.Body>
//       </Modal>

//       {/* 📋 Column Manager Modal */}
//       <Modal show={showColumnManager} onHide={() => setShowColumnManager(false)}>
//         <Modal.Header closeButton>
//           <Modal.Title>Manage Columns</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <h6>Column Visibility:</h6>
//           {Object.entries(columnVisibility).map(([key, visible]) => (
//             <Form.Check
//               key={key}
//               type="checkbox"
//               label={key.charAt(0).toUpperCase() + key.slice(1)}
//               checked={visible}
//               onChange={(e) => setColumnVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
//               className="mb-2"
//             />
//           ))}
//         </Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={() => setShowColumnManager(false)}>
//             Close
//           </Button>
//         </Modal.Footer>
//       </Modal>

//       {/* 🎨 Custom Styles */}
//       <style jsx>{`
//         .enhanced-data-table .table-responsive {
//           max-height: 70vh;
//           overflow-y: auto;
//         }
        
//         .dark-theme {
//           color-scheme: dark;
//         }
        
//         .dark-theme .card {
//           background-color: #212529 !important;
//           border-color: #495057 !important;
//         }
        
//         .dark-theme .table-dark {
//           --bs-table-bg: #212529;
//         }
        
//         @media (max-width: 768px) {
//           .enhanced-data-table .table-responsive {
//             font-size: 0.875rem;
//           }
          
//           .enhanced-data-table .btn-group {
//             flex-direction: column;
//           }
//         }
        
//         .table tbody tr:hover {
//           transform: translateY(-1px);
//           box-shadow: 0 4px 8px rgba(0,0,0,0.1);
//           transition: all 0.2s ease;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default EnhancedDataTable;
import React, { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { 
  Card, Table, Form, Row, Col, Button, Badge, InputGroup, 
  ProgressBar, Modal, Alert, Dropdown, OverlayTrigger, Tooltip,
  ButtonGroup, Container, Spinner
} from 'react-bootstrap';
import { 
  FaSearch, FaDownload, FaSort, FaSortUp, FaSortDown, FaEye, FaChartBar,
  FaTrash, FaStar, FaTags, FaFileExport, FaColumns, FaExpand, FaCompress,
  FaEdit, FaCheck, FaTimes, FaFilter, FaCalendarAlt, FaChevronDown, FaChevronRight,
  FaMobile, FaPrint, FaCode, FaCog, FaPlus, FaCheckSquare, FaSquare, FaSun, FaMoon
} from 'react-icons/fa';

const EnhancedDataTable = ({ data = [], onExport, title = "Advanced Data Analysis" }) => {
  // 🎯 Core State Management
  const [searchTerm, setSearchTerm] = useState('');
  const [regexEnabled, setRegexEnabled] = useState(false);
  const [sentimentFilter, setSentimentFilter] = useState('all');
  const [confidenceFilter, setConfidenceFilter] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [sortField, setSortField] = useState('date');
  const [sortDirection, setSortDirection] = useState('desc');
  
  // 🔄 Advanced Features State
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [expandedRows, setExpandedRows] = useState(new Set());
  const [annotations, setAnnotations] = useState({});
  const [favorites, setFavorites] = useState(new Set());
  const [tags, setTags] = useState({});
  const [columnVisibility, setColumnVisibility] = useState({
    comment: true, sentiment: true, confidence: true, date: true, actions: true
  });
  const [pinnedColumns, setPinnedColumns] = useState(new Set(['comment']));
  
  // 📊 UI State
  const [showAnnotationModal, setShowAnnotationModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [showColumnManager, setShowColumnManager] = useState(false);
  const [modalData, setModalData] = useState({ id: null, text: '', type: 'annotation' });
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 768);
  const [isScrolled, setIsScrolled] = useState(false);
  
  // 📈 Advanced Features
  const [loading, setLoading] = useState(false);
  const [editingCell, setEditingCell] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [bulkProgress, setBulkProgress] = useState({ show: false, current: 0, total: 0 });
  const [filterPresets] = useState({
    'Recent Positive': { sentiment: 'positive', dateRange: { start: new Date(Date.now() - 7*24*60*60*1000).toISOString().split('T')[0] } },
    'High Confidence Negative': { sentiment: 'negative', confidenceFilter: 'high' },
    'Flagged for Review': { favorites: true, confidenceFilter: 'medium' }
  });
  
  const searchTimeoutRef = useRef(null);

  // 🛠️ Utility Functions
  const safeRender = useCallback((value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  }, []);

  // 🔍 Advanced Search with Regex & Debouncing
  const performSearch = useCallback((term) => {
    if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 300);
  }, []);

  // 📊 Smart Summary Cards & Real-time Statistics
  const summaryStats = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return {};
    
    const stats = {
      total: data.length,
      positive: data.filter(item => item.sentiment === 'positive').length,
      negative: data.filter(item => item.sentiment === 'negative').length,
      neutral: data.filter(item => item.sentiment === 'neutral').length,
      avgConfidence: data.reduce((sum, item) => sum + (item.confidence || 0), 0) / data.length,
      highConfidence: data.filter(item => (item.confidence || 0) > 0.8).length,
      recentComments: data.filter(item => {
        const itemDate = new Date(item.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return itemDate > weekAgo;
      }).length
    };
    
    stats.sentimentScore = ((stats.positive - stats.negative) / stats.total * 100).toFixed(1);
    return stats;
  }, [data]);

  // 🎨 Advanced Filtering & Search Logic
  const filteredAndSortedData = useMemo(() => {
    if (!Array.isArray(data) || data.length === 0) return [];

    let filtered = data.filter(item => {
      if (!item || typeof item !== 'object') return false;
      
      const commentText = safeRender(item.comment || item.feedback || item.text || '');
      let matchesSearch = true;
      
      if (searchTerm) {
        if (regexEnabled) {
          try {
            const regex = new RegExp(searchTerm, 'i');
            matchesSearch = regex.test(commentText);
          } catch {
            matchesSearch = commentText.toLowerCase().includes(searchTerm.toLowerCase());
          }
        } else {
          matchesSearch = commentText.toLowerCase().includes(searchTerm.toLowerCase());
        }
      }
      
      const matchesSentiment = sentimentFilter === 'all' || item.sentiment === sentimentFilter;
      const confidence = typeof item.confidence === 'number' ? item.confidence : 0;
      const matchesConfidence = confidenceFilter === 'all' || 
        (confidenceFilter === 'high' && confidence > 0.8) ||
        (confidenceFilter === 'medium' && confidence >= 0.5 && confidence <= 0.8) ||
        (confidenceFilter === 'low' && confidence < 0.5);
      
      let matchesDate = true;
      if (dateRange.start || dateRange.end) {
        const itemDate = new Date(item.date);
        if (dateRange.start && itemDate < new Date(dateRange.start)) matchesDate = false;
        if (dateRange.end && itemDate > new Date(dateRange.end)) matchesDate = false;
      }

      return matchesSearch && matchesSentiment && matchesConfidence && matchesDate;
    });

    if (sortField) {
      filtered.sort((a, b) => {
        let aVal = a[sortField];
        let bVal = b[sortField];
        
        if (sortField === 'confidence') {
          aVal = aVal || 0;
          bVal = bVal || 0;
        } else if (sortField === 'date') {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        } else {
          aVal = safeRender(aVal, '').toLowerCase();
          bVal = safeRender(bVal, '').toLowerCase();
        }
        
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });
    }

    return filtered;
  }, [data, searchTerm, regexEnabled, sentimentFilter, confidenceFilter, dateRange, sortField, sortDirection, safeRender]);

  // 📄 Enhanced Pagination
  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedData, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedData.length / itemsPerPage);

  // 🎯 Event Handlers
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleSelectAll = useCallback(() => {
    if (selectedItems.size === paginatedData.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedData.map((item, index) => item.id || index)));
    }
  }, [selectedItems.size, paginatedData]);

  const handleSelectItem = useCallback((id) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedItems(newSelected);
  }, [selectedItems]);

  const handleBulkAction = useCallback(async (action) => {
    const selectedData = paginatedData.filter((item, index) => 
      selectedItems.has(item.id || index)
    );
    
    setBulkProgress({ show: true, current: 0, total: selectedData.length });
    
    for (let i = 0; i < selectedData.length; i++) {
      setBulkProgress(prev => ({ ...prev, current: i + 1 }));
      
      switch (action) {
        case 'delete':
          // TODO: Database integration - DELETE request
          await new Promise(resolve => setTimeout(resolve, 300));
          break;
        case 'favorite':
          const id = selectedData[i].id || selectedData[i].comment?.substring(0, 10);
          setFavorites(prev => new Set([...prev, id]));
          // TODO: Database integration - UPDATE favorites
          break;
        case 'export':
          // Export selected data
          break;
      }
    }
    
    setBulkProgress({ show: false, current: 0, total: 0 });
    setSelectedItems(new Set());
  }, [selectedItems, paginatedData]);

  const handleAnnotation = useCallback(async (id, text, type = 'annotation') => {
    if (type === 'annotation') {
      setAnnotations(prev => ({ ...prev, [id]: text }));
      // TODO: Database integration - Save annotation
      // await saveAnnotation(id, text);
    } else if (type === 'tag') {
      setTags(prev => ({ ...prev, [id]: text }));
      // TODO: Database integration - Save tag
      // await saveTag(id, text);
    }
    setShowAnnotationModal(false);
    setModalData({ id: null, text: '', type: 'annotation' });
  }, []);

  const applyFilterPreset = useCallback((presetName) => {
    const preset = filterPresets[presetName];
    if (preset) {
      setSentimentFilter(preset.sentiment || 'all');
      setConfidenceFilter(preset.confidenceFilter || 'all');
      setDateRange(preset.dateRange || { start: '', end: '' });
    }
  }, [filterPresets]);

  // 📊 Export Functions
  const exportData = useCallback((format, dataToExport = filteredAndSortedData) => {
    const exportData = {
      metadata: {
        title,
        exportDate: new Date().toISOString(),
        totalItems: dataToExport.length,
        filters: { sentimentFilter, confidenceFilter, searchTerm },
        summary: summaryStats
      },
      data: dataToExport.map((item, index) => ({
        id: item.id || index,
        comment: safeRender(item.comment || item.feedback || item.text),
        sentiment: item.sentiment,
        confidence: item.confidence,
        date: item.date,
        annotation: annotations[item.id] || '',
        tags: tags[item.id] || '',
        isFavorite: favorites.has(item.id || item.comment?.substring(0, 10))
      }))
    };

    const timestamp = new Date().toISOString().split('T')[0];
    
    switch (format) {
      case 'csv':
        const csvContent = convertToCSV(exportData.data);
        downloadFile(csvContent, `${title}-${timestamp}.csv`, 'text/csv');
        break;
      case 'json':
        downloadFile(JSON.stringify(exportData, null, 2), `${title}-${timestamp}.json`, 'application/json');
        break;
    }
  }, [filteredAndSortedData, title, sentimentFilter, confidenceFilter, searchTerm, summaryStats, annotations, tags, favorites, safeRender]);

  const convertToCSV = useCallback((data) => {
    if (!data.length) return '';
    const headers = Object.keys(data[0]);
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => 
        JSON.stringify(row[header] || '')
      ).join(','))
    ].join('\n');
    return csvContent;
  }, []);

  const downloadFile = useCallback((content, filename, mimeType) => {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  // 🎨 Component Renderers
  const getSentimentBadge = useCallback((sentiment, confidence = 0) => {
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
  }, [safeRender]);

  const getSortIcon = useCallback((field) => {
    if (sortField !== field) return <FaSort className="text-muted ms-1" />;
    return sortDirection === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />;
  }, [sortField, sortDirection]);

  const getConfidenceColor = useCallback((confidence = 0) => {
    const confidenceNum = typeof confidence === 'number' ? confidence : 0;
    if (confidenceNum > 0.8) return 'success';
    if (confidenceNum > 0.5) return 'warning';
    return 'danger';
  }, []);

  // Mobile Card Component
  const MobileCardView = ({ item, index }) => {
    const itemId = item.id || index;
    const isSelected = selectedItems.has(itemId);
    const isFavorited = favorites.has(itemId);
    
    return (
      <Card className={`mb-3 border-0 shadow-sm hover-lift ${isDarkMode ? 'bg-dark text-light' : ''} ${isSelected ? 'border-primary' : ''}`}>
        <Card.Body className="p-4">
          <Row>
            <Col xs={12}>
              <div className="d-flex justify-content-between align-items-start mb-3">
                <Form.Check
                  checked={isSelected}
                  onChange={() => handleSelectItem(itemId)}
                />
                <div className="d-flex gap-1">
                  <Button size="sm" variant="outline-primary"><FaEye /></Button>
                  <Button size="sm" variant={isFavorited ? "warning" : "outline-warning"}>
                    <FaStar />
                  </Button>
                  <Button size="sm" variant="outline-info"><FaEdit /></Button>
                </div>
              </div>
              
              <p className="mb-3 fw-medium lh-base">
                {safeRender(item.comment || item.feedback || item.text || '')}
              </p>
              
              <div className="d-flex justify-content-between align-items-center">
                <div className="d-flex gap-2 flex-wrap">
                  {getSentimentBadge(item.sentiment, item.confidence)}
                  <Badge bg="outline-info" className="px-2 py-1">
                    <FaCalendarAlt className="me-1" />
                    {new Date(item.date).toLocaleDateString()}
                  </Badge>
                </div>
                
                <div className="text-end">
                  <div style={{ width: '80px' }}>
                    <ProgressBar 
                      now={(item.confidence || 0) * 100} 
                      variant={getConfidenceColor(item.confidence)}
                      style={{ height: '6px' }}
                    />
                  </div>
                  <small className="text-muted">
                    {((item.confidence || 0) * 100).toFixed(1)}% confidence
                  </small>
                </div>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    );
  };

  // 📱 Responsive Design Handler
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Scroll handler for sticky header
  useEffect(() => {
    const handleScroll = (e) => {
      setIsScrolled(e.target.scrollTop > 0);
    };

    const tableContainer = document.querySelector('.table-responsive');
    if (tableContainer) {
      tableContainer.addEventListener('scroll', handleScroll);
      return () => tableContainer.removeEventListener('scroll', handleScroll);
    }
  }, []);

  // Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'a':
            e.preventDefault();
            handleSelectAll();
            break;
          case 'f':
            e.preventDefault();
            document.querySelector('input[placeholder*="search"]')?.focus();
            break;
          case 'e':
            e.preventDefault();
            setShowExportModal(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleSelectAll]);

  if (!Array.isArray(data) || data.length === 0) {
    return (
      <Card className={`glass-card ${isDarkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Body className="text-center py-5">
          <FaChartBar size={48} className="text-muted mb-3 opacity-50" />
          <h5 className="text-muted">No Data Available</h5>
          <p className="text-muted">Upload or provide data to see detailed analysis</p>
          <Button variant="primary" className="mt-2">
            <FaPlus className="me-1" />
            Import Data
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <div className={`enhanced-data-table ${isDarkMode ? 'dark-theme' : ''}`}>
      {/* 📊 Smart Summary Dashboard */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className={`h-100 shadow-sm glass-card hover-lift ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Body className="text-center">
              <div className={`p-3 rounded-3 mb-3 ${isDarkMode ? 'bg-primary bg-opacity-20' : 'bg-primary bg-opacity-10'}`}>
                <h3 className={`mb-2 fw-bold ${isDarkMode ? 'text-light' : 'text-primary'}`}>
                  {summaryStats.total}
                </h3>
              </div>
              <p className={`mb-0 fw-semibold ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                Total Comments
              </p>
              <small className="text-success">+{summaryStats.recentComments} this week</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`h-100 shadow-sm glass-card hover-lift ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Body className="text-center">
              <div className={`p-3 rounded-3 mb-3 ${isDarkMode ? 'bg-success bg-opacity-20' : 'bg-success bg-opacity-10'}`}>
                <h3 className={`mb-2 fw-bold ${summaryStats.sentimentScore > 0 ? 'text-success' : 'text-danger'} ${isDarkMode ? 'text-light' : ''}`}>
                  {summaryStats.sentimentScore}%
                </h3>
              </div>
              <p className={`mb-0 fw-semibold ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                Sentiment Score
              </p>
              <small className="text-info">{summaryStats.positive}+ / {summaryStats.negative}-</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`h-100 shadow-sm glass-card hover-lift ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Body className="text-center">
              <div className={`p-3 rounded-3 mb-3 ${isDarkMode ? 'bg-warning bg-opacity-20' : 'bg-warning bg-opacity-10'}`}>
                <h3 className={`mb-2 fw-bold ${isDarkMode ? 'text-light' : 'text-warning'}`}>
                  {(summaryStats.avgConfidence * 100).toFixed(1)}%
                </h3>
              </div>
              <p className={`mb-0 fw-semibold ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                Avg Confidence
              </p>
              <small className="text-success">{summaryStats.highConfidence} high confidence</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className={`h-100 shadow-sm glass-card hover-lift ${isDarkMode ? 'bg-dark text-light' : ''}`}>
            <Card.Body className="text-center">
              <div className={`p-3 rounded-3 mb-3 ${isDarkMode ? 'bg-info bg-opacity-20' : 'bg-info bg-opacity-10'}`}>
                <h3 className={`mb-2 fw-bold ${isDarkMode ? 'text-light' : 'text-info'}`}>
                  {selectedItems.size}
                </h3>
              </div>
              <p className={`mb-0 fw-semibold ${isDarkMode ? 'text-light' : 'text-muted'}`}>
                Selected Items
              </p>
              <small className="text-muted">{favorites.size} favorites</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* 🎯 Main Data Container */}
      <Card className={`shadow-sm glass-card ${isDarkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Header className={`${isDarkMode ? 'bg-secondary text-light' : 'bg-light'} ${isScrolled ? 'shadow-sm' : ''}`}>
          <Row className="align-items-center">
            <Col>
              <h5 className="mb-0">
                <FaChartBar className="me-2" />
                {title}
                <Badge bg="info" className="ms-2">{filteredAndSortedData.length}</Badge>
              </h5>
            </Col>
            <Col xs="auto">
              <ButtonGroup size="sm">
                <Button 
                  variant={isDarkMode ? "warning" : "outline-secondary"}
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  title="Toggle Dark Mode"
                >
                  {isDarkMode ? <FaSun /> : <FaMoon />}
                </Button>
                <Button 
                  variant={isMobileView ? "success" : "outline-info"}
                  onClick={() => setIsMobileView(!isMobileView)}
                  title="Toggle Mobile View"
                >
                  <FaMobile />
                </Button>
                <Button 
                  variant="outline-primary"
                  onClick={() => setShowColumnManager(true)}
                >
                  <FaColumns />
                </Button>
                <Button 
                  variant="primary"
                  onClick={() => setShowExportModal(true)}
                >
                  <FaDownload className="me-1" />
                  Export
                </Button>
              </ButtonGroup>
            </Col>
          </Row>
        </Card.Header>

        <Card.Body>
          {/* 🔍 Advanced Filters & Search */}
          <Row className="mb-4">
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Advanced search (Ctrl+F)..."
                  onChange={(e) => performSearch(e.target.value)}
                />
                <Button 
                  variant={regexEnabled ? "success" : "outline-secondary"}
                  onClick={() => setRegexEnabled(!regexEnabled)}
                  title="Enable Regex Search"
                >
                  <FaCode />
                </Button>
              </InputGroup>
            </Col>
            <Col md={2}>
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
            <Col md={2}>
              <Form.Select
                value={confidenceFilter}
                onChange={(e) => setConfidenceFilter(e.target.value)}
              >
                <option value="all">All Confidence</option>
                <option value="high">High (80%+)</option>
                <option value="medium">Medium (50-80%)</option>
                <option value="low">Low (&lt;50%)</option>
              </Form.Select>
            </Col>
            <Col md={2}>
              <Form.Control
                type="date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                placeholder="Start Date"
              />
            </Col>
            <Col md={2}>
              <Dropdown>
                <Dropdown.Toggle variant="outline-info" size="sm" className="w-100">
                  <FaFilter className="me-1" />
                  Quick Filters
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  {Object.keys(filterPresets).map(preset => (
                    <Dropdown.Item key={preset} onClick={() => applyFilterPreset(preset)}>
                      {preset}
                    </Dropdown.Item>
                  ))}
                  <Dropdown.Divider />
                  <Dropdown.Item>
                    <FaPlus className="me-1" /> Save Current as Preset
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </Col>
          </Row>

          {/* 🔄 Bulk Actions */}
          {selectedItems.size > 0 && (
            <Alert variant="info" className="d-flex justify-content-between align-items-center mb-4">
              <span><strong>{selectedItems.size}</strong> items selected</span>
              <ButtonGroup size="sm">
                <Button variant="outline-danger" onClick={() => handleBulkAction('delete')}>
                  <FaTrash className="me-1" />Delete
                </Button>
                <Button variant="outline-warning" onClick={() => handleBulkAction('favorite')}>
                  <FaStar className="me-1" />Favorite
                </Button>
                <Button variant="outline-success" onClick={() => handleBulkAction('export')}>
                  <FaFileExport className="me-1" />Export Selected
                </Button>
              </ButtonGroup>
            </Alert>
          )}

          {/* 📊 Data Display - Responsive */}
          {isMobileView ? (
            // Mobile Card View
            <div className="mobile-card-view">
              {paginatedData.map((item, index) => (
                <MobileCardView key={item.id || index} item={item} index={index} />
              ))}
            </div>
          ) : (
            // Desktop Table View
            <div className="table-responsive table-glow" style={{ maxHeight: '60vh' }}>
              <Table hover className={`align-middle ${isDarkMode ? 'table-dark' : ''}`}>
                <thead 
                  className={`sticky-top ${isScrolled ? 'shadow-sm' : ''} ${isDarkMode ? 'table-secondary' : 'table-light'}`}
                  style={{ position: 'sticky', top: 0, zIndex: 10 }}
                >
                  <tr>
                    <th className="border-0" style={{ width: '50px' }}>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.size === paginatedData.length && paginatedData.length > 0}
                        onChange={handleSelectAll}
                      />
                    </th>
                    {columnVisibility.comment && (
                      <th 
                        style={{ cursor: 'pointer', minWidth: '300px' }} 
                        onClick={() => handleSort('comment')}
                        className="border-0"
                      >
                        Comment {getSortIcon('comment')}
                      </th>
                    )}
                    {columnVisibility.sentiment && (
                      <th 
                        style={{ cursor: 'pointer', minWidth: '120px' }} 
                        onClick={() => handleSort('sentiment')}
                        className="border-0 text-center"
                      >
                        Sentiment {getSortIcon('sentiment')}
                      </th>
                    )}
                    {columnVisibility.confidence && (
                      <th 
                        style={{ cursor: 'pointer', minWidth: '150px' }} 
                        onClick={() => handleSort('confidence')}
                        className="border-0 text-center"
                      >
                        Confidence {getSortIcon('confidence')}
                      </th>
                    )}
                    {columnVisibility.date && (
                      <th 
                        style={{ cursor: 'pointer', minWidth: '120px' }} 
                        onClick={() => handleSort('date')}
                        className="border-0 text-center"
                      >
                        Date {getSortIcon('date')}
                      </th>
                    )}
                    {columnVisibility.actions && (
                      <th className="border-0 text-center" style={{ minWidth: '180px' }}>Actions</th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map((item, index) => {
                    const itemId = item.id || index;
                    const commentText = safeRender(item.comment || item.feedback || item.text, 'No comment');
                    const isExpanded = expandedRows.has(itemId);
                    const isSelected = selectedItems.has(itemId);
                    const isFavorited = favorites.has(itemId);

                    return (
                      <React.Fragment key={itemId}>
                        <tr 
                          className={`border-bottom hover-lift-row ${isSelected ? (isDarkMode ? 'table-active' : 'table-primary') : ''}`}
                          style={{
                            backgroundColor: item.sentiment === 'positive' ? 'rgba(25, 135, 84, 0.1)' :
                                           item.sentiment === 'negative' ? 'rgba(220, 53, 69, 0.1)' :
                                           item.sentiment === 'neutral' ? 'rgba(255, 193, 7, 0.1)' : 'transparent'
                          }}
                        >
                          <td>
                            <div className="d-flex align-items-center">
                              <Form.Check
                                type="checkbox"
                                checked={isSelected}
                                onChange={() => handleSelectItem(itemId)}
                                className="me-2"
                              />
                              <Button
                                variant="link"
                                size="sm"
                                onClick={() => {
                                  const newExpanded = new Set(expandedRows);
                                  if (isExpanded) {
                                    newExpanded.delete(itemId);
                                  } else {
                                    newExpanded.add(itemId);
                                  }
                                  setExpandedRows(newExpanded);
                                }}
                                className="p-0"
                              >
                                {isExpanded ? <FaChevronDown /> : <FaChevronRight />}
                              </Button>
                            </div>
                          </td>
                          
                          {columnVisibility.comment && (
                            <td>
                              <div style={{ maxWidth: '400px' }}>
                                <p className="mb-1 fw-medium">
                                  {commentText.length > 150 ? commentText.substring(0, 150) + '...' : commentText}
                                  {isFavorited && <FaStar className="text-warning ms-2" />}
                                </p>
                                {annotations[itemId] && (
                                  <Alert variant="info" className="mt-2 mb-0 small">
                                    <strong>Note:</strong> {annotations[itemId]}
                                  </Alert>
                                )}
                                {tags[itemId] && (
                                  <div className="mt-1">
                                    <Badge bg="secondary" className="me-1">
                                      <FaTags className="me-1" />{tags[itemId]}
                                    </Badge>
                                  </div>
                                )}
                              </div>
                            </td>
                          )}
                          
                          {columnVisibility.sentiment && (
                            <td className="text-center">
                              {getSentimentBadge(item.sentiment, item.confidence)}
                            </td>
                          )}
                          
                          {columnVisibility.confidence && (
                            <td className="text-center">
                              <div className="d-flex flex-column align-items-center">
                                <div className="mb-2" style={{ width: '80px' }}>
                                  <ProgressBar 
                                    variant={getConfidenceColor(item.confidence)}
                                    now={(item.confidence || 0) * 100} 
                                    style={{ height: '8px' }}
                                  />
                                </div>
                                <Badge bg={getConfidenceColor(item.confidence)} className="px-2">
                                  {((item.confidence || 0) * 100).toFixed(1)}%
                                </Badge>
                              </div>
                            </td>
                          )}
                          
                          {columnVisibility.date && (
                            <td className="text-center">
                              <small className="text-muted">
                                {new Date(item.date).toLocaleDateString()}
                              </small>
                            </td>
                          )}
                          
                          {columnVisibility.actions && (
                            <td className="text-center">
                              <ButtonGroup size="sm">
                                <OverlayTrigger overlay={<Tooltip>View Details</Tooltip>}>
                                  <Button variant="outline-primary">
                                    <FaEye />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Add Note</Tooltip>}>
                                  <Button 
                                    variant="outline-secondary"
                                    onClick={() => {
                                      setModalData({ id: itemId, text: annotations[itemId] || '', type: 'annotation' });
                                      setShowAnnotationModal(true);
                                    }}
                                  >
                                    <FaEdit />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Add to Favorites</Tooltip>}>
                                  <Button 
                                    variant={isFavorited ? "warning" : "outline-warning"}
                                    onClick={() => {
                                      const newFavorites = new Set(favorites);
                                      if (isFavorited) {
                                        newFavorites.delete(itemId);
                                      } else {
                                        newFavorites.add(itemId);
                                      }
                                      setFavorites(newFavorites);
                                      // TODO: Database integration - Save favorite status
                                    }}
                                  >
                                    <FaStar />
                                  </Button>
                                </OverlayTrigger>
                                <OverlayTrigger overlay={<Tooltip>Add Tag</Tooltip>}>
                                  <Button 
                                    variant="outline-info"
                                    onClick={() => {
                                      setModalData({ id: itemId, text: tags[itemId] || '', type: 'tag' });
                                      setShowAnnotationModal(true);
                                    }}
                                  >
                                    <FaTags />
                                  </Button>
                                </OverlayTrigger>
                              </ButtonGroup>
                            </td>
                          )}
                        </tr>
                        
                        {/* Expandable Row Details */}
                        {isExpanded && (
                          <tr>
                            <td colSpan={Object.values(columnVisibility).filter(Boolean).length + 1}>
                              <Card className={`m-2 ${isDarkMode ? 'bg-secondary' : ''}`}>
                                <Card.Header>
                                  <h6 className="mb-0">Detailed Analysis</h6>
                                </Card.Header>
                                <Card.Body>
                                  <Row>
                                    <Col md={6}>
                                      <h6>Full Comment:</h6>
                                      <p className="border p-3 rounded bg-light">{commentText}</p>
                                    </Col>
                                    <Col md={6}>
                                      <h6>Analysis Breakdown:</h6>
                                      <ul className="list-unstyled">
                                        <li><strong>Sentiment:</strong> <span className="text-capitalize">{item.sentiment}</span></li>
                                        <li><strong>Confidence:</strong> {((item.confidence || 0) * 100).toFixed(2)}%</li>
                                        <li><strong>Date:</strong> {new Date(item.date).toLocaleDateString()}</li>
                                        <li><strong>Length:</strong> {commentText.length} characters</li>
                                        <li><strong>Word Count:</strong> {commentText.split(' ').length} words</li>
                                      </ul>
                                      
                                      {item.probabilities && (
                                        <div>
                                          <h6>Probability Breakdown:</h6>
                                          <div className="d-flex gap-2 mb-3">
                                            <Badge bg="success">
                                              Positive: {((item.probabilities.Positive || 0) * 100).toFixed(1)}%
                                            </Badge>
                                            <Badge bg="danger">
                                              Negative: {((item.probabilities.Negative || 0) * 100).toFixed(1)}%
                                            </Badge>
                                            <Badge bg="warning">
                                              Neutral: {((item.probabilities.Neutral || 0) * 100).toFixed(1)}%
                                            </Badge>
                                          </div>
                                        </div>
                                      )}
                                      
                                      {item.keywords && (
                                        <div>
                                          <h6>Keywords:</h6>
                                          <div className="d-flex flex-wrap gap-1">
                                            {item.keywords.map((keyword, idx) => (
                                              <Badge key={idx} bg="light" text="dark">{keyword}</Badge>
                                            ))}
                                          </div>
                                        </div>
                                      )}
                                    </Col>
                                  </Row>
                                </Card.Body>
                              </Card>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </Table>
            </div>
          )}

          {/* 📄 Enhanced Pagination */}
          <Row className="align-items-center mt-4 pt-3 border-top">
            <Col sm={6}>
              <div className="d-flex align-items-center gap-2">
                <small className="text-muted">Show:</small>
                <Form.Select 
                  size="sm" 
                  style={{ width: 'auto' }}
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(Number(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={25}>25</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </Form.Select>
                <small className="text-muted">
                  Showing {((currentPage - 1) * itemsPerPage) + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredAndSortedData.length)} of{' '}
                  {filteredAndSortedData.length} results
                </small>
              </div>
            </Col>
            <Col sm={6}>
              <div className="d-flex justify-content-end align-items-center gap-2">
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(1)}
                >
                  First
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <Form.Control
                  type="number"
                  size="sm"
                  style={{ width: '60px' }}
                  value={currentPage}
                  onChange={(e) => {
                    const page = Math.max(1, Math.min(totalPages, Number(e.target.value)));
                    setCurrentPage(page);
                  }}
                  min={1}
                  max={totalPages}
                />
                <span className="small text-muted">of {totalPages}</span>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
                <Button
                  variant="outline-secondary"
                  size="sm"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(totalPages)}
                >
                  Last
                </Button>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* 📝 Annotation Modal */}
      <Modal show={showAnnotationModal} onHide={() => setShowAnnotationModal(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>
            {modalData.type === 'annotation' ? (
              <><FaEdit className="me-2" />Add Note</>
            ) : (
              <><FaTags className="me-2" />Add Tag</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-light' : ''}>
          <Form.Control
            as="textarea"
            rows={3}
            value={modalData.text}
            onChange={(e) => setModalData(prev => ({ ...prev, text: e.target.value }))}
            placeholder={modalData.type === 'annotation' ? 'Enter your note...' : 'Enter tag name...'}
          />
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setShowAnnotationModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleAnnotation(modalData.id, modalData.text, modalData.type)}
          >
            <FaCheck className="me-1" />
            Save {modalData.type === 'annotation' ? 'Note' : 'Tag'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* 📊 Export Modal */}
      <Modal show={showExportModal} onHide={() => setShowExportModal(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>
            <FaFileExport className="me-2" />
            Export Data
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-light' : ''}>
          <h6>Export Format:</h6>
          <div className="d-grid gap-2 mb-4">
            <Button variant="outline-success" onClick={() => { exportData('csv'); setShowExportModal(false); }}>
              <FaFileExport className="me-1" />CSV (Excel Compatible)
            </Button>
            <Button variant="outline-info" onClick={() => { exportData('json'); setShowExportModal(false); }}>
              <FaFileExport className="me-1" />JSON (Full Data + Metadata)
            </Button>
          </div>
          <Alert variant="info" className="small">
            <FaDownload className="me-1" />
            Export includes: {filteredAndSortedData.length} items, annotations, tags, and metadata.
          </Alert>
        </Modal.Body>
      </Modal>

      {/* 📋 Column Manager Modal */}
      <Modal show={showColumnManager} onHide={() => setShowColumnManager(false)} centered>
        <Modal.Header closeButton className={isDarkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>
            <FaColumns className="me-2" />
            Manage Columns
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className={isDarkMode ? 'bg-dark text-light' : ''}>
          <h6>Column Visibility:</h6>
          {Object.entries(columnVisibility).map(([key, visible]) => (
            <Form.Check
              key={key}
              type="checkbox"
              label={key.charAt(0).toUpperCase() + key.slice(1)}
              checked={visible}
              onChange={(e) => setColumnVisibility(prev => ({ ...prev, [key]: e.target.checked }))}
              className="mb-2"
            />
          ))}
        </Modal.Body>
        <Modal.Footer className={isDarkMode ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setShowColumnManager(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Progress Modal */}
      <Modal show={bulkProgress.show} centered>
        <Modal.Body className="text-center py-4">
          <Spinner animation="border" variant="primary" className="mb-3" />
          <h5>Processing {bulkProgress.current} of {bulkProgress.total}</h5>
          <ProgressBar 
            now={(bulkProgress.current / bulkProgress.total) * 100} 
            className="mt-3"
            style={{ height: '8px' }}
          />
        </Modal.Body>
      </Modal>

      {/* 🎨 Enhanced Custom Styles */}
      <style jsx>{`
        .enhanced-data-table {
          min-height: 100vh;
        }

        .glass-card {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.18);
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .dark-theme .glass-card {
          background: rgba(0, 0, 0, 0.25);
          border: 1px solid rgba(255, 255, 255, 0.18);
        }

        .hover-lift {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        .hover-lift:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .hover-lift-row:hover {
          transform: translateY(-1px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s ease;
        }

        .table-glow {
          position: relative;
          border-radius: 12px;
          overflow: hidden;
        }

        .table-glow::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(45deg, #667eea, #764ba2, #f093fb);
          border-radius: inherit;
          z-index: -1;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .table-glow:hover::before {
          opacity: 0.1;
        }

        .mobile-card-view {
          max-height: 60vh;
          overflow-y: auto;
        }

        .table-responsive {
          border-radius: 12px;
          overflow: hidden;
        }

        .dark-theme {
          color-scheme: dark;
        }

        .dark-theme .card {
          background-color: #212529 !important;
          border-color: #495057 !important;
        }

        .dark-theme .table-dark {
          --bs-table-bg: #212529;
          --bs-table-striped-bg: #2c3034;
          --bs-table-hover-bg: #323539;
        }

        .dark-theme .modal-content {
          background-color: #212529 !important;
          border-color: #495057 !important;
        }

        @media (max-width: 768px) {
          .enhanced-data-table .btn-group {
            flex-direction: column;
            width: 100%;
          }

          .enhanced-data-table .btn-group .btn {
            border-radius: 0.375rem !important;
            margin-bottom: 0.25rem;
          }

          .mobile-card-view {
            padding: 0.5rem;
          }
        }

        /* Smooth theme transitions */
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }

        /* Custom scrollbar */
        .table-responsive::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }

        .table-responsive::-webkit-scrollbar-track {
          background: transparent;
        }

        .table-responsive::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        .dark-theme .table-responsive::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.2);
        }

        /* Accessibility improvements */
        .table th,
        .table td {
          vertical-align: middle;
        }

        .btn:focus,
        .form-control:focus,
        .form-select:focus {
          box-shadow: 0 0 0 0.2rem rgba(102, 126, 234, 0.25);
        }
      `}</style>
    </div>
  );
};

export default EnhancedDataTable;
