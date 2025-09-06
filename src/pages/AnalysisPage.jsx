import React, { useState } from 'react';
import { Container, Row, Col, Card, Badge, Button, ProgressBar, Alert } from 'react-bootstrap';
import { Upload, BarChart3, Cloud, FileText, Download, Zap, TrendingUp, Users, Target } from 'lucide-react';
import FileUpload from '../components/analysis/FileUpload';
import SentimentChart from '../components/analysis/SentimentChart';
import WordCloudComponent from '../components/analysis/WordCloudComponent';
import DataTable from '../components/analysis/DataTable';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { toast } from 'react-toastify';

const AnalysisPage = () => {
  const { user } = useAuth();
  const { theme, isDark } = useTheme();
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [activeTab, setActiveTab] = useState('upload');

  // Safe render function
  const safeRender = (value, fallback = 'N/A') => {
    if (value === null || value === undefined) return fallback;
    if (typeof value === 'object') return JSON.stringify(value);
    return String(value);
  };

  const handleFileUpload = async (data, file) => {
    setIsAnalyzing(true);
    setAnalysisProgress(0);
    
    try {
      const processedData = [];
      
      for (let i = 0; i < data.length; i++) {
        const item = data[i];
        const comment = String(item.comment || item.feedback || item.text || '');
        
        if (comment.trim()) {
          try {
            const response = await fetch('https://koyu008-koyu-senti-bot.hf.space/predict', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                text: comment
              }),
            });
            
            if (!response.ok) {
              throw new Error(`API request failed: ${response.status}`);
            }
            
            const apiResult = await response.json();
            
            const sentiment = String(apiResult.prediction || 'neutral').toLowerCase();
            const confidence = Number(apiResult.probabilities[apiResult.prediction] || 0.5);
            
            processedData.push({
              ...item,
              sentiment,
              confidence,
              probabilities: apiResult.probabilities || { Positive: 0.33, Negative: 0.33, Neutral: 0.34 },
              date: String(item.date || new Date().toISOString().split('T')[0])
            });
            
          } catch (apiError) {
            console.error(`Error processing item ${i + 1}:`, apiError);
            processedData.push({
              ...item,
              sentiment: 'neutral',
              confidence: 0.5,
              probabilities: { Positive: 0.33, Negative: 0.33, Neutral: 0.34 },
              date: String(item.date || new Date().toISOString().split('T')[0])
            });
          }
        } else {
          processedData.push({
            ...item,
            sentiment: 'neutral',
            confidence: 0.5,
            probabilities: { Positive: 0.33, Negative: 0.33, Neutral: 0.34 },
            date: String(item.date || new Date().toISOString().split('T')[0])
          });
        }
        
        const progress = ((i + 1) / data.length) * 100;
        setAnalysisProgress(progress);
        
        if (i < data.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 100));
        }
      }
      
      setAnalysisData(processedData);
      setActiveTab('overview');
      toast.success(`Analysis completed! Processed ${processedData.length} comments.`);
      
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
      setAnalysisProgress(0);
    }
  };

  const handleExportData = () => {
    if (!analysisData) return;
    
    const csvContent = [
      ['Comment', 'Sentiment', 'Confidence', 'Positive_Prob', 'Negative_Prob', 'Neutral_Prob', 'Date'],
      ...analysisData.map(item => [
        `"${String(item.comment || item.feedback || item.text || '').replace(/"/g, '""')}"`,
        String(item.sentiment || ''),
        String((item.confidence || 0).toFixed(3)),
        String((item.probabilities?.Positive || 0).toFixed(3)),
        String((item.probabilities?.Negative || 0).toFixed(3)),
        String((item.probabilities?.Neutral || 0).toFixed(3)),
        String(item.date || '')
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sentiment_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Data exported successfully!');
  };

  // Safe calculations for summary
  const getSummaryData = () => {
    if (!analysisData || !Array.isArray(analysisData)) {
      return {
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        avgConfidence: 0,
        highConfidence: 0
      };
    }

    const total = analysisData.length;
    const positive = analysisData.filter(d => String(d.sentiment) === 'positive').length;
    const negative = analysisData.filter(d => String(d.sentiment) === 'negative').length;
    const neutral = analysisData.filter(d => String(d.sentiment) === 'neutral').length;
    const avgConfidence = analysisData.reduce((sum, item) => sum + Number(item.confidence || 0), 0) / total;
    const highConfidence = analysisData.filter(item => Number(item.confidence || 0) > 0.8).length;

    return { total, positive, negative, neutral, avgConfidence, highConfidence };
  };

  const summaryData = getSummaryData();

  const TabButton = ({ tabKey, icon: Icon, label, isActive, onClick }) => (
    <Button
      variant={isActive ? "primary" : (isDark ? "outline-light" : "outline-primary")}
      className={`d-flex align-items-center gap-2 px-3 py-2 ${isActive ? '' : 'border-0'}`}
      onClick={() => onClick(tabKey)}
      style={{ 
        borderRadius: '12px',
        transition: 'all 0.2s ease',
        fontWeight: isActive ? '600' : '500'
      }}
    >
      <Icon size={18} />
      {label}
    </Button>
  );

  const StatCard = ({ icon: Icon, title, value, color, subtitle }) => (
    <Card className={`border-0 h-100 ${isDark ? 'bg-dark text-light' : 'bg-light'}`} 
          style={{ borderRadius: '16px', transition: 'transform 0.2s ease' }}>
      <Card.Body className="p-4">
        <div className="d-flex align-items-center gap-3 mb-3">
          <div className={`p-2 rounded-circle bg-${color} bg-opacity-10`}>
            <Icon size={24} className={`text-${color}`} />
          </div>
          <div>
            <h6 className="mb-0 fw-bold">{title}</h6>
            {subtitle && <small className={isDark ? 'text-light' : 'text-muted'}>{subtitle}</small>}
          </div>
        </div>
        <h3 className="mb-0 fw-bold">{value}</h3>
      </Card.Body>
    </Card>
  );

  return (
    <div className={`min-vh-100 ${isDark ? 'bg-dark text-light' : 'bg-light'}`}>
      <Container fluid className="p-0">
        {/* Hero Section */}
        <div className={`py-5 ${isDark ? 'bg-gradient-dark' : 'bg-gradient-primary'}`} 
             style={{ 
               background: isDark 
                 ? 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)' 
                 : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
             }}>
          <Container>
            <Row className="align-items-center">
              <Col lg={8}>
                <div className="text-white">
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Zap size={28} className="text-warning" />
                    <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill">
                      AI-Powered Analytics
                    </Badge>
                  </div>
                  <h1 className="display-5 fw-bold mb-3">
                    Government Consultation Analytics
                  </h1>
                  <p className="lead mb-4 opacity-90">
                    Transform public feedback into actionable insights with advanced sentiment analysis, 
                    word cloud generation, and comprehensive data visualization.
                  </p>
                </div>
              </Col>
              <Col lg={4} className="text-center">
                <div className="bg-white bg-opacity-10 p-4 rounded-4 backdrop-blur">
                  <TrendingUp size={64} className="text-warning mb-3" />
                  <h4 className="text-white mb-0">Real-time Processing</h4>
                  <p className="text-white opacity-75 mb-0">Instant AI Analysis</p>
                </div>
              </Col>
            </Row>
          </Container>
        </div>

        <Container className="py-5">
          {/* Navigation Tabs */}
          <Row className="mb-4">
            <Col>
              <div className="d-flex flex-wrap gap-2 p-3 rounded-4" 
                   style={{ backgroundColor: isDark ? '#2d2d2d' : '#f8f9fa' }}>
                <TabButton 
                  tabKey="upload" 
                  icon={Upload} 
                  label="Upload Data" 
                  isActive={activeTab === 'upload'}
                  onClick={setActiveTab}
                />
                <TabButton 
                  tabKey="overview" 
                  icon={Target} 
                  label="Overview" 
                  isActive={activeTab === 'overview'}
                  onClick={setActiveTab}
                  disabled={!analysisData}
                />
                <TabButton 
                  tabKey="sentiment" 
                  icon={BarChart3} 
                  label="Sentiment Analysis" 
                  isActive={activeTab === 'sentiment'}
                  onClick={setActiveTab}
                  disabled={!analysisData}
                />
                <TabButton 
                  tabKey="wordcloud" 
                  icon={Cloud} 
                  label="Word Cloud" 
                  isActive={activeTab === 'wordcloud'}
                  onClick={setActiveTab}
                  disabled={!analysisData}
                />
                <TabButton 
                  tabKey="data" 
                  icon={FileText} 
                  label="Data Table" 
                  isActive={activeTab === 'data'}
                  onClick={setActiveTab}
                  disabled={!analysisData}
                />
              </div>
            </Col>
          </Row>

          {/* Tab Content */}
          {activeTab === 'upload' && (
            <Row>
              <Col lg={6}>
                <Card className={`border-0 shadow-sm h-100 ${isDark ? 'bg-dark' : ''}`} 
                      style={{ borderRadius: '20px' }}>
                  <Card.Body className="p-4">
                    <div className="text-center mb-4">
                      <Upload size={48} className="text-primary mb-3" />
                      <h4 className="fw-bold">Upload Consultation Data</h4>
                      <p className={isDark ? 'text-light' : 'text-muted'}>
                        Drag and drop your consultation data file or click to browse
                      </p>
                    </div>
                    
                    <FileUpload 
                      onFileUpload={handleFileUpload}
                      acceptedFiles={['.json', '.csv', '.xlsx']}
                    />
                    
                    <div className="mt-4 p-3 rounded-3" 
                         style={{ backgroundColor: isDark ? '#2d2d2d' : '#e3f2fd' }}>
                      <h6 className="mb-2">💡 Quick Tip</h6>
                      <p className="mb-0 small">
                        For best results, ensure your file contains a 'comment', 'feedback', or 'text' 
                        field with the stakeholder comments you want to analyze.
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
              
              <Col lg={6}>
                {user && (
                  <Card className={`border-0 shadow-sm mb-4 ${isDark ? 'bg-dark' : ''}`} 
                        style={{ borderRadius: '20px' }}>
                    <Card.Body className="p-4">
                      <div className="d-flex align-items-center gap-3 mb-3">
                        <div className="p-2 rounded-circle bg-primary bg-opacity-10">
                          <Users size={24} className="text-primary" />
                        </div>
                        <div>
                          <h5 className="mb-0 fw-bold">Welcome, {safeRender(user.name)}!</h5>
                          <p className="mb-0 text-muted">Ready to analyze consultation data</p>
                        </div>
                      </div>
                      <p className="mb-0">
                        Upload your consultation data to begin AI-powered analysis and generate 
                        comprehensive insights for evidence-based policy making.
                      </p>
                    </Card.Body>
                  </Card>
                )}
                
                <Card className={`border-0 shadow-sm ${isDark ? 'bg-dark' : ''}`} 
                      style={{ borderRadius: '20px' }}>
                  <Card.Body className="p-4">
                    <h6 className="fw-bold mb-3">📋 Supported Formats</h6>
                    <ul className="list-unstyled mb-0">
                      <li className="mb-2">
                        <Badge bg="success" className="me-2">JSON</Badge>
                        JavaScript Object Notation (Max 10MB)
                      </li>
                      <li className="mb-2">
                        <Badge bg="info" className="me-2">CSV</Badge>
                        Comma-Separated Values (Max 10MB)
                      </li>
                      <li className="mb-0">
                        <Badge bg="warning" className="me-2">XLSX</Badge>
                        Excel Spreadsheet (Max 10MB)
                      </li>
                    </ul>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          )}

          {activeTab === 'overview' && analysisData && (
            <>
              {/* Stats Cards */}
              <Row className="g-4 mb-4">
                <Col md={6} lg={3}>
                  <StatCard 
                    icon={FileText}
                    title="Total Comments"
                    value={summaryData.total.toLocaleString()}
                    color="primary"
                    subtitle="Analyzed responses"
                  />
                </Col>
                <Col md={6} lg={3}>
                  <StatCard 
                    icon={TrendingUp}
                    title="Positive Sentiment"
                    value={`${((summaryData.positive / summaryData.total) * 100).toFixed(1)}%`}
                    color="success"
                    subtitle={`${summaryData.positive} comments`}
                  />
                </Col>
                <Col md={6} lg={3}>
                  <StatCard 
                    icon={Target}
                    title="Avg Confidence"
                    value={`${(summaryData.avgConfidence * 100).toFixed(1)}%`}
                    color="warning"
                    subtitle="AI prediction accuracy"
                  />
                </Col>
                <Col md={6} lg={3}>
                  <StatCard 
                    icon={Zap}
                    title="High Confidence"
                    value={`${summaryData.highConfidence}`}
                    color="info"
                    subtitle="Above 80% confidence"
                  />
                </Col>
              </Row>

              {/* Executive Summary */}
              <Card className={`border-0 shadow-sm mb-4 ${isDark ? 'bg-dark' : ''}`} 
                    style={{ borderRadius: '20px' }}>
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center gap-3 mb-4">
                    <div className="p-2 rounded-circle bg-primary bg-opacity-10">
                      <Target size={24} className="text-primary" />
                    </div>
                    <h4 className="mb-0 fw-bold">Executive Summary</h4>
                  </div>
                  
                  <Row>
                    <Col lg={8}>
                      <p className="lead mb-4">
                        Based on the analysis of <strong>{summaryData.total}</strong> stakeholder comments, 
                        the overall sentiment towards the proposed legislation appears to be{' '}
                        <Badge bg={
                          summaryData.positive > summaryData.negative ? 'success' : 
                          summaryData.negative > summaryData.positive ? 'danger' : 'warning'
                        } className="px-2 py-1">
                          {summaryData.positive > summaryData.negative ? 'Largely Positive' : 
                           summaryData.negative > summaryData.positive ? 'Predominantly Negative' : 
                           'Mixed with Neutral Tendencies'}
                        </Badge>
                      </p>
                      
                      <div className="row g-3">
                        <div className="col-md-4">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-success rounded-circle p-1">
                              <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            </div>
                            <div>
                              <div className="fw-bold">{summaryData.positive}</div>
                              <small className="text-muted">Positive</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-danger rounded-circle p-1">
                              <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            </div>
                            <div>
                              <div className="fw-bold">{summaryData.negative}</div>
                              <small className="text-muted">Negative</small>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4">
                          <div className="d-flex align-items-center gap-2">
                            <div className="bg-warning rounded-circle p-1">
                              <div className="bg-white rounded-circle" style={{ width: '8px', height: '8px' }}></div>
                            </div>
                            <div>
                              <div className="fw-bold">{summaryData.neutral}</div>
                              <small className="text-muted">Neutral</small>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    
                    <Col lg={4}>
                      <div className="text-end">
                        <Button 
                          variant="outline-primary" 
                          className="d-flex align-items-center gap-2 ms-auto"
                          onClick={handleExportData}
                          style={{ borderRadius: '12px' }}
                        >
                          <Download size={18} />
                          Export Data
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </>
          )}

          {activeTab === 'sentiment' && analysisData && (
            <Card className={`border-0 shadow-sm ${isDark ? 'bg-dark' : ''}`} 
                  style={{ borderRadius: '20px' }}>
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">📊 Sentiment Analysis</h4>
                <SentimentChart data={analysisData} />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'wordcloud' && analysisData && (
            <Card className={`border-0 shadow-sm ${isDark ? 'bg-dark' : ''}`} 
                  style={{ borderRadius: '20px' }}>
              <Card.Body className="p-4">
                <h4 className="fw-bold mb-4">☁️ Word Cloud</h4>
                <WordCloudComponent 
                  data={analysisData} 
                  title="Most Frequent Terms in Comments"
                />
              </Card.Body>
            </Card>
          )}

          {activeTab === 'data' && analysisData && (
            <Card className={`border-0 shadow-sm ${isDark ? 'bg-dark' : ''}`} 
                  style={{ borderRadius: '20px' }}>
              <Card.Body className="p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h4 className="fw-bold mb-0">📋 Data Table</h4>
                  <Button 
                    variant="primary" 
                    className="d-flex align-items-center gap-2"
                    onClick={handleExportData}
                    style={{ borderRadius: '12px' }}
                  >
                    <Download size={18} />
                    Export CSV
                  </Button>
                </div>
                <DataTable 
                  data={analysisData} 
                  onExport={handleExportData}
                />
              </Card.Body>
            </Card>
          )}

          {/* Loading State */}
          {isAnalyzing && (
            <Card className={`border-0 shadow-sm ${isDark ? 'bg-dark' : ''}`} 
                  style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5 text-center">
                <div className="mb-4">
                  <div className="spinner-border text-primary mb-3" role="status" style={{ width: '3rem', height: '3rem' }}>
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <h4 className="fw-bold">🤖 AI Analysis in Progress</h4>
                  <p className={`${isDark ? 'text-light' : 'text-muted'} mb-4`}>
                    Processing stakeholder comments through advanced sentiment analysis engine...
                  </p>
                </div>
                
                {analysisProgress > 0 && (
                  <div className="mx-auto" style={{ maxWidth: '400px' }}>
                    <div className="d-flex justify-content-between mb-2">
                      <small className="fw-medium">Processing Comments</small>
                      <small className="fw-medium">{analysisProgress.toFixed(1)}%</small>
                    </div>
                    <ProgressBar 
                      now={analysisProgress} 
                      variant="primary" 
                      style={{ height: '8px', borderRadius: '4px' }}
                    />
                  </div>
                )}
              </Card.Body>
            </Card>
          )}

          {/* Empty State */}
          {!analysisData && !isAnalyzing && activeTab !== 'upload' && (
            <Card className={`border-0 shadow-sm ${isDark ? 'bg-dark' : ''}`} 
                  style={{ borderRadius: '20px' }}>
              <Card.Body className="p-5 text-center">
                <BarChart3 size={64} className={`mb-4 ${isDark ? 'text-light' : 'text-muted'}`} />
                <h4 className={`fw-bold ${isDark ? 'text-light' : 'text-muted'}`}>No Analysis Data Available</h4>
                <p className={isDark ? 'text-light' : 'text-muted'}>
                  Upload consultation data to view AI-powered insights and analytics
                </p>
                <Button 
                  variant="primary" 
                  onClick={() => setActiveTab('upload')}
                  className="mt-3"
                  style={{ borderRadius: '12px' }}
                >
                  Upload Data
                </Button>
              </Card.Body>
            </Card>
          )}
        </Container>
      </Container>
    </div>
  );
};

export default AnalysisPage;
