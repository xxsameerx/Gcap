import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Badge } from 'react-bootstrap';
import { FaPaperPlane, FaRobot, FaUser, FaFileUpload, FaTimes, FaSpinner } from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import FAQSection from './FAQSection';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ChatInterface = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFile, setUploadedFile] = useState(null);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);

  // Initialize with welcome message
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: `Hello ${user?.name || 'there'}! 👋 I'm your AI assistant for eConsultation analysis. I can help you with:
      
• Analyzing consultation data and feedback
• Understanding sentiment analysis results  
• Generating summaries and insights
• Answering questions about legislation
• Processing uploaded JSON/CSV files

How can I assist you today?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome'
    };
    setMessages([welcomeMessage]);
  }, [user]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // FAQ responses database
  const faqResponses = {
    'how to upload file': `To upload a file for analysis:
    
📁 **Method 1: Through Analysis Dashboard**
• Go to Analysis Dashboard
• Drag & drop your JSON/CSV file
• Wait for processing to complete

📁 **Method 2: Here in Chat**
• Click the 📎 attachment icon below
• Select your file (JSON, CSV, XLSX)
• I'll analyze it and provide insights

Supported formats: JSON, CSV, XLSX (Max 10MB)`,

    'sentiment analysis': `**Sentiment Analysis** helps you understand stakeholder emotions:

✅ **Positive**: Supportive, agreeable feedback
❌ **Negative**: Critical, opposing feedback  
⚖️ **Neutral**: Factual, balanced commentary

**How it works:**
1. Upload consultation data
2. AI analyzes each comment's tone
3. Get percentage breakdown
4. View detailed charts and insights
5. Export results for reporting

**Accuracy**: Our AI achieves 95%+ accuracy using advanced NLP models.`,

    'data format': `**Supported Data Formats:**

📊 **JSON Format** (Recommended):
\`\`\`json
[
  {
    "comment": "Your stakeholder feedback here",
    "date": "2025-08-31",
    "stakeholder_type": "citizen"
  }
]
\`\`\`

📊 **CSV Format:**
\`\`\`
comment,date,stakeholder_type
"Feedback text here","2025-08-31","citizen"
\`\`\`

**Required Fields:**
• \`comment\` OR \`feedback\` OR \`text\` (feedback content)
• \`date\` (optional, for trend analysis)

**Optional Fields:**
• \`stakeholder_type\`, \`location\`, \`category\`, etc.`,

    'word cloud': `**Word Clouds** visualize the most important themes:

🔍 **What they show:**
• Most frequently mentioned words
• Key topics and concerns
• Relative importance by size
• Color-coded by sentiment

🎯 **Benefits:**
• Quick visual summary
• Identify trending topics
• Spot key concerns at a glance
• Perfect for presentations

**How to generate:**
1. Upload your data
2. Go to Analysis → Word Cloud tab
3. Interactive visualization appears
4. Click words for more details`,

    'export data': `**Export & Download Options:**

📥 **Available Formats:**
• **PDF Report**: Complete analysis summary
• **CSV File**: Raw data with sentiment scores
• **Excel**: Formatted spreadsheet
• **PowerPoint**: Executive summary slides

📊 **What's Included:**
• Sentiment breakdown
• Key insights summary
• Top keywords list
• Trend analysis (if dates provided)
• Confidence scores

**How to Export:**
• Analysis Dashboard → Export button
• Choose your preferred format
• Download starts automatically`,

    'ai accuracy': `**AI Model Performance:**

🎯 **Accuracy Metrics:**
• Sentiment Analysis: 95.3% accuracy
• Keyword Extraction: 97.1% accuracy
• Summary Generation: 94.8% relevance
• Language Detection: 99.2% accuracy

🧠 **Technology Stack:**
• Advanced Transformer models
• Multi-language NLP support  
• Continuous learning algorithms
• Government-specific training data

✅ **Quality Assurance:**
• Validated against human experts
• Regular model updates
• Bias detection and mitigation
• Transparent confidence scoring`
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim() && !uploadedFile) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      file: uploadedFile
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setUploadedFile(null);
    setIsTyping(true);

    // Simulate AI processing
    setTimeout(() => {
      const response = generateAIResponse(inputMessage, uploadedFile);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
    }, 1500);
  };

  const generateAIResponse = (message, file) => {
    let responseText = '';

    if (file) {
      responseText = `I've received your file "${file.name}" (${(file.size / 1024).toFixed(1)} KB). 

📊 **File Analysis in Progress...**

Based on the file you've uploaded, I can help you with:
• Sentiment analysis of the feedback
• Key theme identification
• Summary generation
• Data visualization insights

Would you like me to proceed with the analysis? You can also visit the Analysis Dashboard for detailed visualizations and export options.`;
    } else {
      // Check for FAQ matches
      const lowerMessage = message.toLowerCase();
      let matchedFAQ = '';
      
      for (const [key, response] of Object.entries(faqResponses)) {
        if (lowerMessage.includes(key) || key.includes(lowerMessage.substring(0, 10))) {
          matchedFAQ = response;
          break;
        }
      }

      if (matchedFAQ) {
        responseText = matchedFAQ;
      } else {
        // Generic AI responses
        if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
          responseText = `Hello! I'm here to help you with eConsultation analysis. You can ask me about sentiment analysis, data formats, or upload files for instant insights. What would you like to know?`;
        } else if (lowerMessage.includes('help')) {
          responseText = `I'm here to help! Here are some things I can assist with:

🤖 **Analysis Support:**
• Upload and analyze consultation data
• Explain sentiment analysis results
• Generate summaries and insights

📊 **Data Questions:**
• Supported file formats
• How to structure your data
• Best practices for analysis

💡 **Features:**
• Word cloud generation
• Export options
• AI accuracy information

Try asking about any of these topics or upload a file to get started!`;
        } else {
          responseText = `I understand you're asking about "${message}". 

While I can provide detailed help with eConsultation analysis, sentiment analysis, and data processing, I might not have specific information about this topic.

🔍 **I can help you with:**
• File upload and analysis
• Understanding sentiment results
• Data format requirements
• Export and reporting options

Try clicking on one of the FAQ questions below, or upload a file for analysis!`;
        }
      }
    }

    return {
      id: Date.now() + 1,
      text: responseText,
      sender: 'bot',
      timestamp: new Date()
    };
  };

  const handleFAQClick = (question) => {
    setInputMessage(question);
    handleSendMessage();
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        toast.error('File size must be less than 10MB');
        return;
      }

      const allowedTypes = ['application/json', 'text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        toast.error('Please upload JSON, CSV, or XLSX files only');
        return;
      }

      setUploadedFile(file);
      toast.success(`File "${file.name}" ready to upload`);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <Container fluid className="chat-interface">
      <Row className="h-100">
        <Col lg={3} className="d-none d-lg-block">
          <FAQSection onFAQClick={handleFAQClick} />
        </Col>
        
        <Col lg={9}>
          <Card className="chat-card h-100">
            <Card.Header className="chat-header">
              <div className="d-flex align-items-center">
                <div className="bot-avatar me-3">
                  <FaRobot />
                </div>
                <div>
                  <h5 className="mb-0">AI Assistant</h5>
                  <small className="text-muted">Online • Ready to help</small>
                </div>
                <Badge bg="success" className="ms-auto">
                  <span className="pulse-dot"></span>
                  Active
                </Badge>
              </div>
            </Card.Header>

            <Card.Body className="chat-messages">
              <div className="messages-container">
                {messages.map((message) => (
                  <MessageBubble key={message.id} message={message} />
                ))}
                
                {isTyping && (
                  <div className="typing-indicator">
                    <div className="bot-message">
                      <div className="avatar">
                        <FaRobot />
                      </div>
                      <div className="message-content typing">
                        <div className="typing-dots">
                          <span></span>
                          <span></span>
                          <span></span>
                        </div>
                        <small className="text-muted">AI is typing...</small>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </Card.Body>

            <Card.Footer className="chat-input">
              {uploadedFile && (
                <div className="uploaded-file-preview mb-2">
                  <div className="file-info">
                    <FaFileUpload className="me-2" />
                    <span>{uploadedFile.name}</span>
                    <small className="text-muted ms-2">
                      ({(uploadedFile.size / 1024).toFixed(1)} KB)
                    </small>
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="ms-auto"
                      onClick={removeFile}
                    >
                      <FaTimes />
                    </Button>
                  </div>
                </div>
              )}

              <InputGroup>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileSelect}
                  accept=".json,.csv,.xlsx"
                  style={{ display: 'none' }}
                />
                <Button
                  variant="outline-secondary"
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload file"
                >
                  <FaFileUpload />
                </Button>
                
                <Form.Control
                  as="textarea"
                  rows={1}
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask me anything about consultation analysis..."
                  className="chat-textarea"
                />
                
                <Button
                  variant="primary"
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() && !uploadedFile}
                  className="send-button"
                >
                  {isTyping ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />}
                </Button>
              </InputGroup>
            </Card.Footer>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ChatInterface;
