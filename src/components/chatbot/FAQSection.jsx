// import React, { useState } from 'react';
// import { Card, Accordion, Badge, Button } from 'react-bootstrap';
// import { FaQuestionCircle, FaChevronRight, FaFileAlt, FaChartLine, FaCloud, FaDownload, FaBrain, FaUpload } from 'react-icons/fa';

// const FAQSection = ({ onFAQClick }) => {
//   const [activeKey, setActiveKey] = useState('0');

//   const faqCategories = [
//     {
//       title: 'Getting Started',
//       icon: <FaQuestionCircle />,
//       questions: [
//         {
//           question: 'How to upload file',
//           preview: 'Learn how to upload consultation data...',
//           icon: <FaUpload />
//         },
//         {
//           question: 'Data format',
//           preview: 'Supported file formats and structure...',
//           icon: <FaFileAlt />
//         }
//       ]
//     },
//     {
//       title: 'Analysis Features',
//       icon: <FaChartLine />,
//       questions: [
//         {
//           question: 'Sentiment analysis',
//           preview: 'Understanding stakeholder emotions...',
//           icon: <FaChartLine />
//         },
//         {
//           question: 'Word cloud',
//           preview: 'Visualize key themes and topics...',
//           icon: <FaCloud />
//         }
//       ]
//     },
//     {
//       title: 'Export & Reports',
//       icon: <FaDownload />,
//       questions: [
//         {
//           question: 'Export data',
//           preview: 'Download results in various formats...',
//           icon: <FaDownload />
//         },
//         {
//           question: 'AI accuracy',
//           preview: 'Learn about our AI model performance...',
//           icon: <FaBrain />
//         }
//       ]
//     }
//   ];

//   const popularQuestions = [
//     'How to upload file',
//     'Sentiment analysis',
//     'Data format',
//     'Word cloud',
//     'Export data'
//   ];

//   return (
//     <div className="faq-section">
//       <Card className="faq-card mb-3">
//         <Card.Header className="faq-header">
//           <h6 className="mb-0">
//             <FaQuestionCircle className="me-2" />
//             Frequently Asked Questions
//           </h6>
//         </Card.Header>
//         <Card.Body className="p-0">
//           {/* Popular Questions */}
//           <div className="popular-questions p-3">
//             <small className="text-muted fw-bold">POPULAR QUESTIONS</small>
//             <div className="mt-2">
//               {popularQuestions.map((question, index) => (
//                 <Button
//                   key={index}
//                   variant="outline-primary"
//                   size="sm"
//                   className="me-2 mb-2 popular-question-btn"
//                   onClick={() => onFAQClick(question)}
//                 >
//                   {question}
//                   <FaChevronRight className="ms-1" />
//                 </Button>
//               ))}
//             </div>
//           </div>

//           {/* Categorized FAQ */}
//           <Accordion activeKey={activeKey} onSelect={setActiveKey} flush>
//             {faqCategories.map((category, categoryIndex) => (
//               <Accordion.Item eventKey={categoryIndex.toString()} key={categoryIndex}>
//                 <Accordion.Header>
//                   <div className="d-flex align-items-center">
//                     <span className="category-icon me-2">{category.icon}</span>
//                     {category.title}
//                     <Badge bg="secondary" className="ms-auto me-2">
//                       {category.questions.length}
//                     </Badge>
//                   </div>
//                 </Accordion.Header>
//                 <Accordion.Body className="p-0">
//                   {category.questions.map((faq, questionIndex) => (
//                     <div
//                       key={questionIndex}
//                       className="faq-item"
//                       onClick={() => onFAQClick(faq.question)}
//                     >
//                       <div className="d-flex align-items-start">
//                         <span className="faq-icon me-3">{faq.icon}</span>
//                         <div className="flex-grow-1">
//                           <div className="faq-question">{faq.question}</div>
//                           <small className="faq-preview text-muted">
//                             {faq.preview}
//                           </small>
//                         </div>
//                         <FaChevronRight className="text-muted" />
//                       </div>
//                     </div>
//                   ))}
//                 </Accordion.Body>
//               </Accordion.Item>
//             ))}
//           </Accordion>
//         </Card.Body>
//       </Card>

//       {/* Quick Actions */}
//       <Card className="quick-actions-card">
//         <Card.Body className="text-center">
//           <h6 className="mb-3">Quick Actions</h6>
//           <div className="d-grid gap-2">
//             <Button
//               variant="primary"
//               size="sm"
//               onClick={() => onFAQClick('How to upload file')}
//             >
//               <FaUpload className="me-2" />
//               Upload File Guide
//             </Button>
//             <Button
//               variant="success"
//               size="sm"
//               onClick={() => onFAQClick('Sentiment analysis')}
//             >
//               <FaChartLine className="me-2" />
//               Learn Analysis
//             </Button>
//             <Button
//               variant="info"
//               size="sm"
//               onClick={() => onFAQClick('Data format')}
//             >
//               <FaFileAlt className="me-2" />
//               Check Formats
//             </Button>
//           </div>
//         </Card.Body>
//       </Card>
//     </div>
//   );
// };

// export default FAQSection;
import React, { useState } from 'react';
import { Card, Accordion, Badge, Button, Form, InputGroup } from 'react-bootstrap';
import { 
  FaQuestionCircle, FaChevronRight, FaFileAlt, FaChartLine, 
  FaCloud, FaDownload, FaBrain, FaUpload, FaSearch, FaStar,
  FaMicrophone, FaLanguage, FaCog, FaHistory
} from 'react-icons/fa';

const FAQSection = ({ onFAQClick, darkMode }) => {
  const [activeKey, setActiveKey] = useState('0');
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCategories, setFilteredCategories] = useState([]);

  const faqCategories = [
    {
      title: 'Getting Started',
      icon: <FaQuestionCircle />,
      color: 'primary',
      questions: [
        {
          question: 'How to upload file',
          preview: 'Step-by-step guide for uploading consultation data files',
          icon: <FaUpload />,
          difficulty: 'Beginner',
          estimatedTime: '2 min'
        },
        {
          question: 'Data format',
          preview: 'Supported file formats, structure requirements, and examples',
          icon: <FaFileAlt />,
          difficulty: 'Beginner',
          estimatedTime: '3 min'
        },
        {
          question: 'Voice commands',
          preview: 'Use voice input for hands-free interaction',
          icon: <FaMicrophone />,
          difficulty: 'Beginner',
          estimatedTime: '1 min'
        }
      ]
    },
    {
      title: 'Analysis Features',
      icon: <FaChartLine />,
      color: 'success',
      questions: [
        {
          question: 'Sentiment analysis',
          preview: 'Advanced emotion detection and stakeholder insights',
          icon: <FaChartLine />,
          difficulty: 'Intermediate',
          estimatedTime: '5 min'
        },
        {
          question: 'Word cloud',
          preview: 'Interactive visualization of key themes and topics',
          icon: <FaCloud />,
          difficulty: 'Beginner',
          estimatedTime: '2 min'
        },
        {
          question: 'AI accuracy',
          preview: 'Understanding model performance and reliability metrics',
          icon: <FaBrain />,
          difficulty: 'Advanced',
          estimatedTime: '4 min'
        }
      ]
    },
    {
      title: 'Export & Reports',
      icon: <FaDownload />,
      color: 'info',
      questions: [
        {
          question: 'Export data',
          preview: 'Download results in multiple formats (PDF, Excel, PPT)',
          icon: <FaDownload />,
          difficulty: 'Intermediate',
          estimatedTime: '3 min'
        },
        {
          question: 'Generate summary report',
          preview: 'Automated comprehensive analysis reports',
          icon: <FaFileAlt />,
          difficulty: 'Intermediate',
          estimatedTime: '2 min'
        }
      ]
    },
    {
      title: 'Advanced Features',
      icon: <FaCog />,
      color: 'warning',
      questions: [
        {
          question: 'Multi-language support',
          preview: 'Analyze content in English, Hindi, and other languages',
          icon: <FaLanguage />,
          difficulty: 'Advanced',
          estimatedTime: '3 min'
        },
        {
          question: 'Historical analysis',
          preview: 'Compare trends across different time periods',
          icon: <FaHistory />,
          difficulty: 'Advanced',
          estimatedTime: '5 min'
        }
      ]
    }
  ];

  const popularQuestions = [
    { text: 'How to upload file', icon: <FaUpload />, popularity: 95 },
    { text: 'Sentiment analysis', icon: <FaChartLine />, popularity: 89 },
    { text: 'Export data', icon: <FaDownload />, popularity: 82 },
    { text: 'Data format', icon: <FaFileAlt />, popularity: 78 },
    { text: 'Word cloud', icon: <FaCloud />, popularity: 71 }
  ];

  // Filter categories based on search
  React.useEffect(() => {
    if (searchTerm) {
      const filtered = faqCategories.map(category => ({
        ...category,
        questions: category.questions.filter(
          q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
               q.preview.toLowerCase().includes(searchTerm.toLowerCase())
        )
      })).filter(category => category.questions.length > 0);
      setFilteredCategories(filtered);
    } else {
      setFilteredCategories(faqCategories);
    }
  }, [searchTerm]);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Beginner': return 'success';
      case 'Intermediate': return 'warning';
      case 'Advanced': return 'danger';
      default: return 'secondary';
    }
  };

  return (
    <div className={`faq-section ${darkMode ? 'dark-mode' : 'light-mode'}`}>
      {/* Search Box */}
      <Card className={`faq-search-card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Body className="p-3">
          <InputGroup>
            <Form.Control
              type="text"
              placeholder="Search FAQ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={darkMode ? 'bg-dark text-light border-secondary' : ''}
            />
            <Button variant="outline-primary">
              <FaSearch />
            </Button>
          </InputGroup>
        </Card.Body>
      </Card>

      {/* Popular Questions */}
      <Card className={`faq-card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Header className="faq-header">
          <h6 className="mb-0 d-flex align-items-center">
            <FaStar className="me-2 text-warning" />
            Most Popular Questions
          </h6>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="popular-questions p-3">
            {popularQuestions.map((question, index) => (
              <Button
                key={index}
                variant="outline-primary"
                size="sm"
                className="me-2 mb-2 popular-question-btn d-flex align-items-center"
                onClick={() => onFAQClick(question.text)}
              >
                <span className="me-1">{question.icon}</span>
                {question.text}
                <Badge bg="success" className="ms-2" style={{ fontSize: '0.6rem' }}>
                  {question.popularity}%
                </Badge>
              </Button>
            ))}
          </div>
        </Card.Body>
      </Card>

      {/* Categorized FAQ */}
      <Card className={`faq-card mb-3 ${darkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Header className="faq-header">
          <h6 className="mb-0">
            <FaQuestionCircle className="me-2" />
            All Categories
          </h6>
        </Card.Header>
        <Card.Body className="p-0">
          <Accordion activeKey={activeKey} onSelect={setActiveKey} flush>
            {filteredCategories.map((category, categoryIndex) => (
              <Accordion.Item 
                eventKey={categoryIndex.toString()} 
                key={categoryIndex}
                className={darkMode ? 'bg-dark text-light' : ''}
              >
                <Accordion.Header className={darkMode ? 'accordion-header-dark' : ''}>
                  <div className="d-flex align-items-center w-100">
                    <span className={`category-icon me-2 text-${category.color}`}>
                      {category.icon}
                    </span>
                    <span className="flex-grow-1">{category.title}</span>
                    <Badge bg={category.color} className="me-2">
                      {category.questions.length}
                    </Badge>
                  </div>
                </Accordion.Header>
                <Accordion.Body className={`p-0 ${darkMode ? 'bg-dark' : ''}`}>
                  {category.questions.map((faq, questionIndex) => (
                    <div
                      key={questionIndex}
                      className={`faq-item ${darkMode ? 'faq-item-dark' : ''}`}
                      onClick={() => onFAQClick(faq.question)}
                    >
                      <div className="d-flex align-items-start p-3">
                        <span className="faq-icon me-3 text-primary">{faq.icon}</span>
                        <div className="flex-grow-1">
                          <div className="faq-question d-flex align-items-center mb-1">
                            {faq.question}
                            <Badge 
                              bg={getDifficultyColor(faq.difficulty)} 
                              className="ms-2"
                              style={{ fontSize: '0.6rem' }}
                            >
                              {faq.difficulty}
                            </Badge>
                          </div>
                          <small className={`faq-preview ${darkMode ? 'text-light' : 'text-muted'}`}>
                            {faq.preview}
                          </small>
                          <div className="mt-1">
                            <small className={`${darkMode ? 'text-info' : 'text-primary'}`}>
                              ⏱️ {faq.estimatedTime} read
                            </small>
                          </div>
                        </div>
                        <FaChevronRight className={darkMode ? 'text-light' : 'text-muted'} />
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
      <Card className={`quick-actions-card ${darkMode ? 'bg-dark text-light' : ''}`}>
        <Card.Header>
          <h6 className="mb-0">🚀 Quick Start</h6>
        </Card.Header>
        <Card.Body className="text-center">
          <div className="d-grid gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={() => onFAQClick('How to upload file')}
              className="d-flex align-items-center justify-content-center"
            >
              <FaUpload className="me-2" />
              Upload File Guide
            </Button>
            <Button
              variant="success"
              size="sm"
              onClick={() => onFAQClick('Sentiment analysis')}
              className="d-flex align-items-center justify-content-center"
            >
              <FaChartLine className="me-2" />
              Learn Analysis
            </Button>
            <Button
              variant="info"
              size="sm"
              onClick={() => onFAQClick('Export data')}
              className="d-flex align-items-center justify-content-center"
            >
              <FaDownload className="me-2" />
              Export Options
            </Button>
          </div>
          
          <div className="mt-3 pt-3 border-top">
            <small className={darkMode ? 'text-light' : 'text-muted'}>
              💡 <strong>Pro Tip:</strong> Use voice commands for faster interaction
            </small>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FAQSection;
