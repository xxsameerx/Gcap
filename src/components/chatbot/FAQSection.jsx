import React, { useState } from 'react';
import { Card, Accordion, Badge, Button } from 'react-bootstrap';
import { FaQuestionCircle, FaChevronRight, FaFileAlt, FaChartLine, FaCloud, FaDownload, FaBrain, FaUpload } from 'react-icons/fa';

const FAQSection = ({ onFAQClick }) => {
  const [activeKey, setActiveKey] = useState('0');

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <FaQuestionCircle />,
      questions: [
        {
          question: 'How to upload file',
          preview: 'Learn how to upload consultation data...',
          icon: <FaUpload />
        },
        {
          question: 'Data format',
          preview: 'Supported file formats and structure...',
          icon: <FaFileAlt />
        }
      ]
    },
    {
      title: 'Analysis Features',
      icon: <FaChartLine />,
      questions: [
        {
          question: 'Sentiment analysis',
          preview: 'Understanding stakeholder emotions...',
          icon: <FaChartLine />
        },
        {
          question: 'Word cloud',
          preview: 'Visualize key themes and topics...',
          icon: <FaCloud />
        }
      ]
    },
    {
      title: 'Export & Reports',
      icon: <FaDownload />,
      questions: [
        {
          question: 'Export data',
          preview: 'Download results in various formats...',
          icon: <FaDownload />
        },
        {
          question: 'AI accuracy',
          preview: 'Learn about our AI model performance...',
          icon: <FaBrain />
        }
      ]
    }
  ];

  const popularQuestions = [
    'How to upload file',
    'Sentiment analysis',
    'Data format',
    'Word cloud',
    'Export data'
  ];

  return (
    <div className="faq-section">
      <Card className="faq-card mb-3">
        <Card.Header className="faq-header">
          <h6 className="mb-0">
            <FaQuestionCircle className="me-2" />
            Frequently Asked Questions
          </h6>
        </Card.Header>
        <Card.Body className="p-0">
          {/* Popular Questions */}
          <div className="popular-questions p-3">
            <small className="text-muted fw-bold">POPULAR QUESTIONS</small>
            <div className="mt-2">
              {popularQuestions.map((question, index) => (
                <Button
                  key={index}
                  variant="outline-primary"
                  size="sm"
                  className="me-2 mb-2 popular-question-btn"
                  onClick={() => onFAQClick(question)}
                >
                  {question}
                  <FaChevronRight className="ms-1" />
                </Button>
              ))}
            </div>
          </div>

          {/* Categorized FAQ */}
          <Accordion activeKey={activeKey} onSelect={setActiveKey} flush>
            {faqCategories.map((category, categoryIndex) => (
              <Accordion.Item eventKey={categoryIndex.toString()} key={categoryIndex}>
                <Accordion.Header>
                  <div className="d-flex align-items-center">
                    <span className="category-icon me-2">{category.icon}</span>
                    {category.title}
                    <Badge bg="secondary" className="ms-auto me-2">
                      {category.questions.length}
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body className="p-0">
                  {category.questions.map((faq, questionIndex) => (
                    <div
                      key={questionIndex}
                      className="faq-item"
                      onClick={() => onFAQClick(faq.question)}
                    >
                      <div className="d-flex align-items-start">
                        <span className="faq-icon me-3">{faq.icon}</span>
                        <div className="flex-grow-1">
                          <div className="faq-question">{faq.question}</div>
                          <small className="faq-preview text-muted">
                            {faq.preview}
                          </small>
                        </div>
                        <FaChevronRight className="text-muted" />
                      </div>
                    </div>
                  ))}
                </Accordion.Body>
              </Accordion.Item>
            ))}
          </Accordion>
        </Card.Body>
      </Card>

      {/* Quick Actions */}
      <Card className="quick-actions-card">
        <Card.Body className="text-center">
          <h6 className="mb-3">Quick Actions</h6>
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onFAQClick('How to upload file')}
            >
              <FaUpload className="me-2" />
              Upload File Guide
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onFAQClick('Sentiment analysis')}
            >
              <FaChartLine className="me-2" />
              Learn Analysis
            </Button>
            <Button
              variant="info"
              size="sm"
              onClick={() => onFAQClick('Data format')}
            >
              <FaFileAlt className="me-2" />
              Check Formats
            </Button>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FAQSection;
