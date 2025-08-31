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

  const handleFileUpload = async (data, file) => {
    setIsAnalyzing(true);
    
    try {
      // Simulate AI analysis process
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock sentiment analysis - in real app, this would be API call
      const processedData = data.map(item => {
        const comment = item.comment || item.feedback || item.text || '';
        
        // Simple mock sentiment analysis
        const positive_words = ['good', 'great', 'excellent', 'love', 'amazing', 'perfect', 'wonderful'];
        const negative_words = ['bad', 'terrible', 'hate', 'awful', 'poor', 'worst', 'horrible'];
        
        const text_lower = comment.toLowerCase();
        const positive_count = positive_words.reduce((count, word) => 
          text_lower.includes(word) ? count + 1 : count, 0);
        const negative_count = negative_words.reduce((count, word) => 
          text_lower.includes(word) ? count + 1 : count, 0);
        
        let sentiment;
        if (positive_count > negative_count) {
          sentiment = 'positive';
        } else if (negative_count > positive_count) {
          sentiment = 'negative';
        } else {
          sentiment = 'neutral';
        }
        
        return {
          ...item,
          sentiment,
          confidence: Math.random() * 0.3 + 0.7, // Mock confidence score
          date: item.date || new Date().toISOString().split('T')[0]
        };
      });
      
      setAnalysisData(processedData);
      toast.success('Analysis completed successfully!');
      
    } catch (error) {
      toast.error('Analysis failed. Please try again.');
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportData = () => {
    if (!analysisData) return;
    
    const csvContent = [
      ['Comment', 'Sentiment', 'Confidence', 'Date'],
      ...analysisData.map(item => [
        `"${(item.comment || item.feedback || item.text || '').replace(/"/g, '""')}"`,
        item.sentiment,
        item.confidence?.toFixed(2) || 'N/A',
        item.date
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `sentiment_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    link.click();
    
    toast.success('Data exported successfully!');
  };

  return (
    <div className="analysis-page py-4">
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <h2 className="fw-bold">Analysis Dashboard</h2>
            <p className="text-muted">
              Upload consultation data and get instant insights with AI-powered analysis
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
                  <strong>Welcome, {user.name}!</strong><br />
                  Upload your consultation data to begin analysis.
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
                <h5>Analyzing your data...</h5>
                <p className="text-muted">
                  Our AI is processing stakeholder comments and generating insights.
                </p>
              </div>
            ) : analysisData ? (
              <Tabs defaultActiveKey="sentiment" id="analysis-tabs" className="mb-3">
                <Tab eventKey="sentiment" title="Sentiment Analysis">
                  <SentimentChart data={analysisData} />
                </Tab>
                
                <Tab eventKey="wordcloud" title="Word Cloud">
                  <WordCloudComponent 
                    data={analysisData} 
                    title="Most Frequent Terms"
                  />
                </Tab>
                
                <Tab eventKey="summary" title="AI Summary">
                  <div className="bg-light p-4 rounded">
                    <h5>Executive Summary</h5>
                    <p>
                      Based on the analysis of {analysisData.length} stakeholder comments, 
                      the overall sentiment towards the proposed legislation appears to be{' '}
                      <strong>
                        {(() => {
                          const sentiments = analysisData.map(d => d.sentiment);
                          const positive = sentiments.filter(s => s === 'positive').length;
                          const negative = sentiments.filter(s => s === 'negative').length;
                          
                          if (positive > negative) return 'largely positive';
                          if (negative > positive) return 'predominantly negative';
                          return 'mixed with neutral tendencies';
                        })()}
                      </strong>.
                    </p>
                    
                    <h6>Key Insights:</h6>
                    <ul>
                      <li>
                        {analysisData.filter(d => d.sentiment === 'positive').length} positive comments 
                        ({((analysisData.filter(d => d.sentiment === 'positive').length / analysisData.length) * 100).toFixed(1)}%)
                      </li>
                      <li>
                        {analysisData.filter(d => d.sentiment === 'negative').length} negative comments
                        ({((analysisData.filter(d => d.sentiment === 'negative').length / analysisData.length) * 100).toFixed(1)}%)
                      </li>
                      <li>
                        {analysisData.filter(d => d.sentiment === 'neutral').length} neutral comments
                        ({((analysisData.filter(d => d.sentiment === 'neutral').length / analysisData.length) * 100).toFixed(1)}%)
                      </li>
                    </ul>
                  </div>
                </Tab>
                
                <Tab eventKey="data" title="Data Table">
                  <DataTable 
                    data={analysisData} 
                    onExport={handleExportData}
                  />
                </Tab>
              </Tabs>
            ) : (
              <div className="text-center py-5 bg-light rounded">
                <h5 className="text-muted">No Analysis Data</h5>
                <p className="text-muted">
                  Upload a file to see sentiment analysis, word clouds, and detailed insights.
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
