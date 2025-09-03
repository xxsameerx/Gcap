import React, { useState } from 'react';
import { Container, Row, Col, Tabs, Tab, Alert } from 'react-bootstrap';
import FileUpload from '../components/analysis/FileUpload';
import SentimentChart from '../components/analysis/SentimentChart';
import WordCloudComponent from '../components/analysis/WordCloudComponent';
import DataTable from '../components/analysis/DataTable';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const AnalysisPage = () => {
  const { user } = useAuth();
  const [analysisData, setAnalysisData] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);

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

  return (
    <div className="analysis-page py-4">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">AI-Powered Analysis Dashboard</h2>
            <p className="text-muted">
              Upload consultation data and get instant insights with advanced sentiment analysis
            </p>
          </Col>
        </Row>

        <Row>
          <Col lg={4} className="mb-4">
            <FileUpload 
              onFileUpload={handleFileUpload}
              acceptedFiles={['.json', '.csv', '.xlsx']}
            />
            
            {user && (
              <Alert variant="info" className="mt-3">
                <small>
                  <strong>Welcome, {safeRender(user.name)}!</strong><br />
                  Upload your consultation data to begin AI analysis.
                </small>
              </Alert>
            )}
          </Col>
          
          <Col lg={8}>
            {isAnalyzing ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <h5>Analyzing your data with AI...</h5>
                <p className="text-muted mb-3">
                  Processing stakeholder comments through advanced sentiment analysis.
                </p>
                {analysisProgress > 0 && (
                  <div className="progress mx-auto mb-2" style={{ width: '300px', height: '8px' }}>
                    <div 
                      className="progress-bar bg-primary" 
                      role="progressbar" 
                      style={{ width: `${analysisProgress}%` }}
                      aria-valuenow={analysisProgress}
                      aria-valuemin="0" 
                      aria-valuemax="100"
                    />
                  </div>
                )}
                {analysisProgress > 0 && (
                  <small className="text-muted d-block">
                    Processing: {analysisProgress.toFixed(1)}% complete
                  </small>
                )}
              </div>
            ) : analysisData ? (
              <Tabs defaultActiveKey="sentiment" id="analysis-tabs" className="mb-3">
                <Tab eventKey="sentiment" title="📊 Sentiment Analysis">
                  <SentimentChart data={analysisData} />
                </Tab>
                
                <Tab eventKey="wordcloud" title="☁️ Word Cloud">
                  <WordCloudComponent 
                    data={analysisData} 
                    title="Most Frequent Terms"
                  />
                </Tab>
                
                <Tab eventKey="summary" title="🤖 AI Summary">
                  <div className="bg-light p-4 rounded shadow-sm">
                    <h5 className="mb-3">🎯 Executive Summary</h5>
                    <p className="lead">
                      Based on the analysis of <strong>{summaryData.total}</strong> stakeholder comments, 
                      the overall sentiment towards the proposed legislation appears to be{' '}
                      <strong className={
                        summaryData.positive > summaryData.negative ? 'text-success' : 
                        summaryData.negative > summaryData.positive ? 'text-danger' : 'text-warning'
                      }>
                        {summaryData.positive > summaryData.negative ? 'largely positive' : 
                         summaryData.negative > summaryData.positive ? 'predominantly negative' : 
                         'mixed with neutral tendencies'}
                      </strong>.
                    </p>
                    
                    <h6 className="mt-4 mb-3">📈 Key Insights:</h6>
                    <Row>
                      <Col md={6}>
                        <ul className="list-unstyled">
                          <li className="mb-2">
                            <span className="badge bg-success me-2">✓</span>
                            <strong>{summaryData.positive}</strong> positive comments 
                            ({((summaryData.positive / summaryData.total) * 100).toFixed(1)}%)
                          </li>
                          <li className="mb-2">
                            <span className="badge bg-danger me-2">✗</span>
                            <strong>{summaryData.negative}</strong> negative comments
                            ({((summaryData.negative / summaryData.total) * 100).toFixed(1)}%)
                          </li>
                          <li className="mb-2">
                            <span className="badge bg-warning me-2">◐</span>
                            <strong>{summaryData.neutral}</strong> neutral comments
                            ({((summaryData.neutral / summaryData.total) * 100).toFixed(1)}%)
                          </li>
                        </ul>
                      </Col>
                      <Col md={6}>
                        <div className="bg-white p-3 rounded border">
                          <h6 className="mb-2">🎯 Confidence Metrics</h6>
                          <p className="mb-1">
                            <strong>Average Confidence:</strong> {(summaryData.avgConfidence * 100).toFixed(1)}%
                          </p>
                          <p className="mb-0">
                            <strong>High Confidence:</strong> {summaryData.highConfidence} comments ({((summaryData.highConfidence / summaryData.total) * 100).toFixed(1)}%)
                          </p>
                        </div>
                      </Col>
                    </Row>
                  </div>
                </Tab>
                
                <Tab eventKey="data" title="📋 Data Table">
                  <DataTable 
                    data={analysisData} 
                    onExport={handleExportData}
                  />
                </Tab>
              </Tabs>
            ) : (
              <div className="text-center py-5 bg-light rounded shadow-sm">
                <div className="mb-3">
                  <i className="fas fa-chart-line fa-3x text-muted"></i>
                </div>
                <h5 className="text-muted">No Analysis Data</h5>
                <p className="text-muted">
                  Upload a file to see AI-powered sentiment analysis, word clouds, and detailed insights.
                </p>
              </div>
            )}
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default AnalysisPage;
