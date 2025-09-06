import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Form, Button, InputGroup, Badge, Dropdown, Modal, ProgressBar, Accordion, OverlayTrigger, Tooltip, Tab, Tabs } from 'react-bootstrap';
import { 
  FaPaperPlane, FaRobot, FaUser, FaFileUpload, FaTimes, FaSpinner, 
  FaMicrophone, FaMicrophoneSlash, FaImage, FaVideo, FaDownload, 
  FaCopy, FaThumbsUp, FaThumbsDown, FaMoon, FaSun, FaExpand, 
  FaCompress, FaLanguage, FaCog, FaTrash, FaBookmark, FaReply,
  FaChartBar, FaSearch, FaFilter, FaExport, FaTag, FaHistory,
  FaCloudUploadAlt, FaShare, FaPrint, FaEdit, FaFlag, FaHeart,
  FaLaugh, FaAngry, FaSadCry, FaSurprise, FaBold, FaItalic,
  FaCode, FaQuoteLeft, FaLink, FaCalendarAlt, FaClock,
  FaKeyboard, FaVolumeUp, FaMagic, FaChevronDown, FaEye,
  FaGlobe, FaRandom, FaFileExport, FaFilePdf, FaFileWord,
  FaFileExcel, FaUndo, FaRedo, FaSearchPlus
} from 'react-icons/fa';
import MessageBubble from './MessageBubble';
import FAQSection from './FAQSection';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const ChatInterface = () => {
  const { user } = useAuth();
  
  // Core States
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  
  // Voice Features
  const [isRecording, setIsRecording] = useState(false);
  const [recognition, setRecognition] = useState(null);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(false);
  
  // UI States
  const [darkMode, setDarkMode] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [language, setLanguage] = useState('en');
  const [showSettings, setShowSettings] = useState(false);
  
  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredMessages, setFilteredMessages] = useState([]);
  const [messageFilter, setMessageFilter] = useState('all');
  const [advancedSearch, setAdvancedSearch] = useState({
    dateRange: { start: null, end: null },
    hasAttachments: false,
    sentiment: 'all',
    tags: []
  });
  
  // Chat Management
  const [savedChats, setSavedChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [chatTitle, setChatTitle] = useState('');
  
  // New Advanced Features
  const [messageReactions, setMessageReactions] = useState({});
  const [bookmarkedMessages, setBookmarkedMessages] = useState([]);
  const [messageTags, setMessageTags] = useState({});
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  
  // Analytics & Export
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [chatStats, setChatStats] = useState({
    totalMessages: 0,
    averageResponseTime: 0,
    topicBreakdown: {},
    sentimentScore: 0
  });
  const [exportFormat, setExportFormat] = useState('pdf');
  
  // Templates & Suggestions
  const [quickTemplates, setQuickTemplates] = useState([
    "Can you analyze the sentiment of this data?",
    "Generate a summary report for the last consultation",
    "Export findings to PDF format",
    "Compare this with previous analysis",
    "What are the key insights from this dataset?"
  ]);
  const [smartSuggestions, setSmartSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  // Formatting & Rich Text
  const [textFormatting, setTextFormatting] = useState({
    bold: false, italic: false, code: false, quote: false
  });
  const [showFormatting, setShowFormatting] = useState(false);
  
  // Translation & Accessibility
  const [translationEnabled, setTranslationEnabled] = useState(false);
  const [targetTranslationLang, setTargetTranslationLang] = useState('hi');
  const [translatedMessages, setTranslatedMessages] = useState({});
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  
  // Collaboration & Sharing
  const [collaborators, setCollaborators] = useState([]);
  const [shareableLink, setShareableLink] = useState('');
  const [isSharing, setIsSharing] = useState(false);
  
  // Scheduling & Reminders
  const [scheduledMessages, setScheduledMessages] = useState([]);
  const [showScheduler, setShowScheduler] = useState(false);
  const [reminderTime, setReminderTime] = useState('');
  
  // Keyboard Shortcuts
  const [keyboardShortcuts] = useState({
    'Ctrl+Enter': 'Send message',
    'Ctrl+K': 'Search messages',
    'Ctrl+N': 'New chat',
    'Ctrl+S': 'Save chat',
    'Ctrl+E': 'Export chat',
    'Ctrl+B': 'Bold text',
    'Ctrl+I': 'Italic text',
    'Ctrl+/': 'Show shortcuts',
    'Escape': 'Cancel current action'
  });
  
  // Refs
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const chatContainerRef = useRef(null);
  const inputRef = useRef(null);
  
  // Initialize speech recognition
  useEffect(() => {
    const initSpeechRecognition = () => {
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognitionInstance = new SpeechRecognition();
        
        recognitionInstance.continuous = false;
        recognitionInstance.interimResults = false;
        recognitionInstance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
        
        recognitionInstance.onstart = () => {
          setIsListening(true);
          toast.info('🎤 Listening... Speak now!');
        };
        
        recognitionInstance.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          const confidence = event.results[0][0].confidence;
          setInputMessage(transcript);
          toast.success(`Voice: "${transcript}" (${Math.round(confidence * 100)}%)`);
          processVoiceCommand(transcript);
        };
        
        recognitionInstance.onerror = (event) => {
          setIsListening(false);
          setIsRecording(false);
          handleSpeechError(event.error);
        };
        
        recognitionInstance.onend = () => {
          setIsListening(false);
          setIsRecording(false);
        };
        
        setRecognition(recognitionInstance);
        setSpeechSupported(true);
      }
    };
    
    initSpeechRecognition();
  }, [language]);

  // Handle speech errors
  const handleSpeechError = (error) => {
    switch (error) {
      case 'network':
        toast.error('🌐 Network error. Check internet connection.');
        break;
      case 'no-speech':
        toast.warning('🤫 No speech detected. Try again.');
        break;
      case 'not-allowed':
        toast.error('🚫 Microphone access denied.');
        break;
      default:
        toast.error(`❌ Speech error: ${error}`);
    }
  };

  // Voice command processing
  const processVoiceCommand = (transcript) => {
    const commands = {
      'upload file': () => fileInputRef.current?.click(),
      'clear chat': () => clearChat(),
      'save chat': () => saveCurrentChat(),
      'dark mode': () => setDarkMode(true),
      'light mode': () => setDarkMode(false),
      'show analytics': () => setShowAnalytics(true),
      'export chat': () => exportChat('pdf'),
      'new chat': () => startNewChat(),
      'bookmark this': () => bookmarkLastMessage(),
      'translate': () => setTranslationEnabled(!translationEnabled)
    };
    
    const lowerTranscript = transcript.toLowerCase();
    for (const [command, action] of Object.entries(commands)) {
      if (lowerTranscript.includes(command)) {
        setTimeout(action, 500);
        toast.success(`✅ Command: "${command}"`);
        return;
      }
    }
    
    toast.info('💬 Voice input ready. Click send or try a command.');
  };

  // Voice toggle
  const handleVoiceToggle = async () => {
    if (isRecording || isListening) {
      recognition?.stop();
      setIsRecording(false);
      setIsListening(false);
      return;
    }

    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      if (recognition && speechSupported) {
        setIsRecording(true);
        recognition.start();
      }
    } catch (error) {
      toast.error('🚫 Microphone access denied.');
    }
  };

  // Theme management
  useEffect(() => {
    const savedTheme = localStorage.getItem('gcap-theme');
    if (savedTheme) setDarkMode(savedTheme === 'dark');
  }, []);

  useEffect(() => {
    localStorage.setItem('gcap-theme', darkMode ? 'dark' : 'light');
    document.body.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  // Initialize chat
  useEffect(() => {
    const welcomeMessage = {
      id: Date.now(),
      text: `🎉 **Welcome to GCAP AI Assistant!**

🚀 **New Features:**
• Message reactions (👍👎❤️😂😮😢)
• Smart suggestions & templates
• Advanced export options (PDF, DOCX, Excel)
• Message bookmarks & tags
• Real-time collaboration
• Keyboard shortcuts (Ctrl+/)
• Voice commands & translation
• Analytics dashboard

🎯 **Quick Actions:**
• Upload multiple files (drag & drop)
• Use voice commands
• Search & filter messages
• Export conversations
• Schedule messages

${speechSupported ? '🎤 Voice ready!' : '📼 Audio recording available'}

How can I help you today?`,
      sender: 'bot',
      timestamp: new Date(),
      type: 'welcome',
      confidence: 1.0
    };
    setMessages([welcomeMessage]);
  }, [speechSupported]);

  // Message filtering and search
  useEffect(() => {
    let filtered = messages;
    
    if (searchTerm) {
      filtered = filtered.filter(msg => 
        msg.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        msg.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    if (messageFilter !== 'all') {
      filtered = filtered.filter(msg => msg.sender === messageFilter);
    }
    
    if (advancedSearch.hasAttachments) {
      filtered = filtered.filter(msg => msg.files?.length > 0);
    }
    
    if (advancedSearch.sentiment !== 'all') {
      filtered = filtered.filter(msg => msg.sentiment === advancedSearch.sentiment);
    }
    
    setFilteredMessages(filtered);
  }, [messages, searchTerm, messageFilter, advancedSearch]);

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Generate smart suggestions
  const generateSmartSuggestions = useCallback((inputText) => {
    const suggestions = [];
    const lowerInput = inputText.toLowerCase();
    
    if (lowerInput.includes('analyz')) {
      suggestions.push('Show sentiment analysis dashboard');
    }
    if (lowerInput.includes('export')) {
      suggestions.push('Export to PDF format');
    }
    if (lowerInput.includes('data')) {
      suggestions.push('Upload consultation data');
    }
    
    setSmartSuggestions(suggestions.slice(0, 3));
    setShowSuggestions(suggestions.length > 0);
  }, []);

  // Enhanced AI response
  const generateAIResponse = (message, files = []) => {
    const confidence = Math.random() * 0.3 + 0.7;
    
    let responseText = '';
    
    if (files.length > 0) {
      responseText = `✅ **${files.length} File(s) Analyzed Successfully**

📊 **Analysis Summary:**
${files.map((file, idx) => `
• **${file.name}** (${(file.size / 1024).toFixed(1)}KB)
  - Format: ${file.type.split('/')[1]?.toUpperCase() || 'Unknown'}
  - Status: ✅ Processed
  - Records: ~${Math.floor(Math.random() * 1000) + 100}
`).join('')}

🎯 **Key Insights:**
• Sentiment Distribution: 45% Positive, 30% Neutral, 25% Negative
• Main Topics: ${Math.floor(Math.random() * 5) + 3} themes identified
• Data Quality: ${Math.floor(Math.random() * 20) + 80}%
• Confidence: ${(confidence * 100).toFixed(1)}%

**Available Actions:**
• View detailed analytics
• Export comprehensive report
• Generate visualizations
• Compare with historical data

Would you like me to dive deeper into any aspect?`;
    } else {
      const lowerMessage = message.toLowerCase();
      
      if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
        responseText = `👋 Hello ${user?.name || 'there'}! 

🌟 **Enhanced Features Ready:**
• Voice commands & translation
• Smart suggestions
• Advanced analytics
• Multi-format export
• Real-time collaboration

Try saying "show analytics" or "export chat"!`;
      } else if (lowerMessage.includes('help')) {
        responseText = `🆘 **Enhanced Help Center**

**🎤 Voice Commands:**
• "Upload file" - File picker
• "Clear chat" - Reset conversation
• "Export chat" - Download conversation
• "Show analytics" - View insights
• "Dark mode" - Switch theme

**⌨️ Keyboard Shortcuts:**
• Ctrl+Enter: Send message
• Ctrl+K: Search messages
• Ctrl+S: Save chat
• Ctrl+E: Export
• Ctrl+/: Show shortcuts

**🔧 New Features:**
• Message reactions & bookmarks
• Advanced search & filters  
• Smart templates & suggestions
• Multi-format export
• Translation support

What would you like to explore?`;
      } else {
        responseText = `I understand you're asking about "${message}".

🎯 **How I can help:**
• Government consultation analysis
• Sentiment & trend analysis
• Data visualization & reporting
• Multi-language processing
• Export in various formats

💡 **Try these:**
• Upload your data files
• Use voice commands
• Explore the analytics dashboard
• Check out smart templates

What specific analysis would you like?`;
      }
    }

    return {
      id: Date.now() + 1,
      text: responseText,
      sender: 'bot',
      timestamp: new Date(),
      confidence,
      sentiment: Math.random() > 0.5 ? 'positive' : 'neutral'
    };
  };

  // Send message
  const handleSendMessage = async () => {
    if (!inputMessage.trim() && uploadedFiles.length === 0) return;

    const userMessage = {
      id: Date.now(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date(),
      files: uploadedFiles,
      replyTo: replyTo?.id,
      formatted: textFormatting
    };

    setMessages(prev => [...prev, userMessage]);
    
    // Update stats
    setChatStats(prev => ({
      ...prev,
      totalMessages: prev.totalMessages + 1
    }));

    setInputMessage('');
    setUploadedFiles([]);
    setReplyTo(null);
    setTextFormatting({ bold: false, italic: false, code: false, quote: false });
    setIsTyping(true);

    setTimeout(() => {
      const response = generateAIResponse(inputMessage, uploadedFiles);
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      setUploadProgress(0);
    }, 1500);
  };

  // File handling
  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        toast.error(`${file.name} exceeds 10MB limit`);
        return false;
      }
      return true;
    });

    setUploadedFiles(prev => [...prev, ...validFiles]);
    validFiles.forEach(file => {
      toast.success(`📁 ${file.name} ready for analysis`);
    });
  };

  // Drag and drop
  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    handleFileSelect({ target: { files } });
  };

  // Message reactions
  const addReaction = (messageId, reaction) => {
    setMessageReactions(prev => ({
      ...prev,
      [messageId]: {
        ...prev[messageId],
        [reaction]: (prev[messageId]?.[reaction] || 0) + 1
      }
    }));
    toast.success(`${reaction} reaction added!`);
  };

  // Bookmark message
  const toggleBookmark = (messageId) => {
    setBookmarkedMessages(prev => {
      const isBookmarked = prev.includes(messageId);
      if (isBookmarked) {
        toast.info('📑 Bookmark removed');
        return prev.filter(id => id !== messageId);
      } else {
        toast.success('🔖 Message bookmarked!');
        return [...prev, messageId];
      }
    });
  };

  // Reply to message
  const replyToMessage = (message) => {
    setReplyTo(message);
    inputRef.current?.focus();
    toast.info(`↩️ Replying to message`);
  };

  // Export chat
  const exportChat = (format) => {
    const chatData = {
      title: chatTitle || `Chat ${new Date().toLocaleDateString()}`,
      messages: messages,
      stats: chatStats,
      timestamp: new Date()
    };

    switch (format) {
      case 'pdf':
        toast.success('📄 Exporting to PDF...');
        break;
      case 'docx':
        toast.success('📝 Exporting to Word...');
        break;
      case 'excel':
        toast.success('📊 Exporting to Excel...');
        break;
      case 'json':
        const blob = new Blob([JSON.stringify(chatData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `chat-${Date.now()}.json`;
        a.click();
        toast.success('💾 JSON file downloaded!');
        break;
    }
  };

  // Save chat
  const saveCurrentChat = () => {
    const chatData = {
      id: currentChatId || Date.now(),
      title: chatTitle || `Chat ${new Date().toLocaleDateString()}`,
      messages,
      stats: chatStats,
      timestamp: new Date()
    };
    
    const saved = [...savedChats.filter(chat => chat.id !== chatData.id), chatData];
    setSavedChats(saved);
    localStorage.setItem('gcap-saved-chats', JSON.stringify(saved));
    toast.success('💾 Chat saved successfully!');
  };

  // Clear chat
  const clearChat = () => {
    setMessages([]);
    setCurrentChatId(null);
    setChatTitle('');
    setMessageReactions({});
    setBookmarkedMessages([]);
    toast.info('🧹 Chat cleared');
  };

  // Start new chat
  const startNewChat = () => {
    if (messages.length > 1) {
      saveCurrentChat();
    }
    clearChat();
    toast.success('✨ New chat started!');
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key) {
          case 'Enter':
            e.preventDefault();
            handleSendMessage();
            break;
          case 'k':
            e.preventDefault();
            document.getElementById('search-messages')?.focus();
            break;
          case 's':
            e.preventDefault();
            saveCurrentChat();
            break;
          case 'e':
            e.preventDefault();
            exportChat('pdf');
            break;
          case 'n':
            e.preventDefault();
            startNewChat();
            break;
          case '/':
            e.preventDefault();
            setShowSettings(true);
            break;
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [inputMessage, uploadedFiles]);

  // Generate input suggestions
  useEffect(() => {
    if (inputMessage.length > 2) {
      generateSmartSuggestions(inputMessage);
    } else {
      setShowSuggestions(false);
    }
  }, [inputMessage, generateSmartSuggestions]);

  // Bookmark last message
  const bookmarkLastMessage = () => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage) {
      toggleBookmark(lastMessage.id);
    }
  };



// Add this fullscreen toggle function
const toggleFullscreen = async () => {
  const elem = document.documentElement;

  try {
    if (!document.fullscreenElement) {
      // Enter fullscreen
      if (elem.requestFullscreen) {
        await elem.requestFullscreen();
      } else if (elem.mozRequestFullScreen) { /* Firefox */
        await elem.mozRequestFullScreen();
      } else if (elem.webkitRequestFullscreen) { /* Chrome, Safari & Opera */
        await elem.webkitRequestFullscreen();
      } else if (elem.msRequestFullscreen) { /* IE/Edge */
        await elem.msRequestFullscreen();
      }
      setIsFullscreen(true);
      toast.success('🖥️ Entered fullscreen mode');
    } else {
      // Exit fullscreen
      if (document.exitFullscreen) {
        await document.exitFullscreen();
      } else if (document.mozCancelFullScreen) {
        await document.mozCancelFullScreen();
      } else if (document.webkitExitFullscreen) {
        await document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        await document.msExitFullscreen();
      }
      setIsFullscreen(false);
      toast.info('📱 Exited fullscreen mode');
    }
  } catch (error) {
    toast.error('❌ Fullscreen not supported');
    console.error('Fullscreen error:', error);
  }
};

// Add event listener to track fullscreen changes
useEffect(() => {
  const handleFullscreenChange = () => {
    setIsFullscreen(!!document.fullscreenElement);
  };

  document.addEventListener('fullscreenchange', handleFullscreenChange);
  document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
  document.addEventListener('mozfullscreenchange', handleFullscreenChange);
  document.addEventListener('MSFullscreenChange', handleFullscreenChange);

  return () => {
    document.removeEventListener('fullscreenchange', handleFullscreenChange);
    document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    document.removeEventListener('MSFullscreenChange', handleFullscreenChange);
  };
}, []);

  return (
    <div 
      className={`chat-interface enhanced ${darkMode ? 'dark-mode' : 'light-mode'} ${isFullscreen ? 'fullscreen' : ''}`}
      ref={chatContainerRef}
      data-theme={darkMode ? 'dark' : 'light'}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <Container fluid className="h-100">
        <Row className="h-100">
          {/* Enhanced FAQ Sidebar */}
          <Col lg={3} className={`faq-sidebar d-none d-lg-block ${darkMode ? 'bg-dark' : 'bg-light'}`}>
            <div className="p-3">
              <h6 className="mb-3">📚 Quick Help</h6>
              <FAQSection onFAQClick={setInputMessage} darkMode={darkMode} />
              
              {/* Bookmarked Messages */}
              {bookmarkedMessages.length > 0 && (
                <div className="mt-4">
                  <h6>🔖 Bookmarks ({bookmarkedMessages.length})</h6>
                  <div className="bookmarks-list">
                    {bookmarkedMessages.slice(-5).map(messageId => {
                      const message = messages.find(m => m.id === messageId);
                      return message ? (
                        <div key={messageId} className="bookmark-item p-2 mb-2 rounded" style={{fontSize: '0.8rem'}}>
                          {message.text.substring(0, 60)}...
                        </div>
                      ) : null;
                    })}
                  </div>
                </div>
              )}

              {/* Quick Templates */}
              <div className="mt-4">
                <h6>⚡ Quick Templates</h6>
                {quickTemplates.slice(0, 3).map((template, idx) => (
                  <Button
                    key={idx}
                    size="sm"
                    variant="outline-primary"
                    className="d-block mb-2 text-start"
                    style={{fontSize: '0.75rem'}}
                    onClick={() => setInputMessage(template)}
                  >
                    {template.substring(0, 40)}...
                  </Button>
                ))}
              </div>
            </div>
          </Col>
          
          {/* Main Chat Area */}
          <Col lg={9} className="chat-main">
            <Card className={`chat-card h-100 ${darkMode ? 'bg-dark text-light' : 'bg-light'}`}>
              {/* Enhanced Header */}
              <Card.Header className={`chat-header ${darkMode ? 'bg-secondary' : 'bg-primary'}`}>
                <div className="d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center">
                    <div className="bot-avatar me-3">
                      <FaRobot />
                    </div>
                    <div>
                      <h5 className="mb-0 text-white">Enhanced GCAP AI</h5>
                      <small className="text-light">
                        {speechSupported ? '🎤 Voice Ready' : '📼 Audio Available'} | 
                        {messages.length} messages | 
                        {bookmarkedMessages.length} bookmarks
                      </small>
                    </div>
                    <Badge bg="success" className="ms-3">
                      <span className="pulse-dot"></span>
                      Enhanced
                    </Badge>
                  </div>
                  
                  {/* Header Controls */}
                  <div className="header-controls d-flex align-items-center flex-wrap">
                    {/* Search */}
                    <InputGroup size="sm" className="me-2" style={{maxWidth: '180px'}}>
                      <Form.Control
                        id="search-messages"
                        placeholder="Search messages..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className={darkMode ? 'bg-dark text-light' : ''}
                      />
                      <Button variant="outline-light" size="sm">
                        <FaSearch />
                      </Button>
                    </InputGroup>
                    
                    {/* Export Dropdown */}
                    <Dropdown className="me-2">
                      <Dropdown.Toggle variant="outline-light" size="sm" title="Export Options">
                        <FaFileExport />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className={darkMode ? 'dropdown-menu-dark' : ''}>
                        <Dropdown.Item onClick={() => exportChat('pdf')}>
                          <FaFilePdf className="me-2" />PDF Report
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => exportChat('docx')}>
                          <FaFileWord className="me-2" />Word Document
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => exportChat('excel')}>
                          <FaFileExcel className="me-2" />Excel Spreadsheet
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => exportChat('json')}>
                          <FaDownload className="me-2" />JSON Data
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>

                    {/* Analytics */}
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>View Analytics</Tooltip>}>
                      <Button 
                        variant="outline-light" 
                        size="sm" 
                        className="me-2"
                        onClick={() => setShowAnalytics(true)}
                      >
                        <FaChartBar />
                      </Button>
                    </OverlayTrigger>

                    {/* Collaboration */}
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Share & Collaborate</Tooltip>}>
                      <Button 
                        variant="outline-light" 
                        size="sm" 
                        className="me-2"
                        onClick={() => setIsSharing(true)}
                      >
                        <FaShare />
                      </Button>
                    </OverlayTrigger>

                    {/* Save */}
                    <OverlayTrigger placement="bottom" overlay={<Tooltip>Save Chat (Ctrl+S)</Tooltip>}>
                      <Button 
                        variant="outline-light" 
                        size="sm" 
                        className="me-2"
                        onClick={saveCurrentChat}
                      >
                        <FaBookmark />
                      </Button>
                    </OverlayTrigger>
                    {/* Fullscreen Toggle - Add this before the theme toggle */}
<OverlayTrigger placement="bottom" overlay={<Tooltip>{isFullscreen ? 'Exit Fullscreen (F11)' : 'Enter Fullscreen (F11)'}</Tooltip>}>
  <Button 
    variant="outline-light" 
    size="sm" 
    className="me-2"
    onClick={toggleFullscreen}
    title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
  >
    {isFullscreen ? <FaCompress /> : <FaExpand />}
  </Button>
</OverlayTrigger>


                    {/* Theme Toggle */}
                    <Button 
                      variant="outline-light" 
                      size="sm" 
                      className="me-2"
                      onClick={() => setDarkMode(!darkMode)}
                      title="Toggle Theme"
                    >
                      {darkMode ? <FaSun /> : <FaMoon />}
                    </Button>

                    {/* Settings */}
                    <Button 
                      variant="outline-light" 
                      size="sm"
                      onClick={() => setShowSettings(true)}
                      title="Settings (Ctrl+/)"
                    >
                      <FaCog />
                    </Button>
                  </div>
                </div>

                {/* Progress Bar */}
                {uploadProgress > 0 && uploadProgress < 100 && (
                  <ProgressBar 
                    now={uploadProgress} 
                    label={`Processing ${uploadProgress}%`}
                    className="mt-2"
                    variant="success"
                    animated
                  />
                )}

                {/* Active Filters */}
                {(searchTerm || messageFilter !== 'all') && (
                  <div className="mt-2">
                    <small className="text-light me-3">
                      Active filters: {searchTerm && `Search: "${searchTerm}"`} 
                      {messageFilter !== 'all' && ` | Type: ${messageFilter}`}
                    </small>
                    <Button 
                      size="sm" 
                      variant="outline-light"
                      onClick={() => {
                        setSearchTerm('');
                        setMessageFilter('all');
                      }}
                    >
                      Clear Filters
                    </Button>
                  </div>
                )}
              </Card.Header>

              {/* Enhanced Messages Area */}
              <Card.Body className={`chat-messages ${darkMode ? 'bg-dark' : 'bg-white'}`}>
                <div className="messages-container">
                  {(searchTerm || messageFilter !== 'all' ? filteredMessages : messages).map((message) => (
                    <div key={message.id} className="message-wrapper">
                      {/* Reply indicator */}
                      {message.replyTo && (
                        <div className="reply-indicator mb-1">
                          <small className="text-muted">
                            <FaReply className="me-1" />
                            Replying to previous message
                          </small>
                        </div>
                      )}
                      
                      {/* Message with enhanced features */}
                      <div className={`message-bubble ${message.sender === 'user' ? 'user-message' : 'bot-message'}`}>
                        <div className="message-content">
                          {/* Message text */}
                          <div className="message-text">
                            {message.text}
                          </div>
                          
                          {/* Message metadata */}
                          <div className="message-meta d-flex justify-content-between align-items-center mt-2">
                            <small className="text-muted">
                              {new Date(message.timestamp).toLocaleTimeString()}
                              {message.confidence && ` • ${(message.confidence * 100).toFixed(1)}% confidence`}
                            </small>
                            
                            {/* Message actions */}
                            <div className="message-actions">
                              <OverlayTrigger placement="top" overlay={<Tooltip>Copy</Tooltip>}>
                                <Button 
                                  size="sm" 
                                  variant="outline-secondary"
                                  onClick={() => {
                                    navigator.clipboard.writeText(message.text);
                                    toast.success('📋 Copied!');
                                  }}
                                >
                                  <FaCopy />
                                </Button>
                              </OverlayTrigger>
                              
                              <OverlayTrigger placement="top" overlay={<Tooltip>Bookmark</Tooltip>}>
                                <Button 
                                  size="sm" 
                                  variant={bookmarkedMessages.includes(message.id) ? "warning" : "outline-secondary"}
                                  onClick={() => toggleBookmark(message.id)}
                                >
                                  <FaBookmark />
                                </Button>
                              </OverlayTrigger>
                              
                              <OverlayTrigger placement="top" overlay={<Tooltip>Reply</Tooltip>}>
                                <Button 
                                  size="sm" 
                                  variant="outline-secondary"
                                  onClick={() => replyToMessage(message)}
                                >
                                  <FaReply />
                                </Button>
                              </OverlayTrigger>
                            </div>
                          </div>
                          
                          {/* Message reactions */}
                          <div className="message-reactions mt-2">
                            <div className="d-flex gap-1 flex-wrap">
                              {['👍', '👎', '❤️', '😂', '😮', '😢'].map(reaction => (
                                <button
                                  key={reaction}
                                  className="reaction-btn"
                                  onClick={() => addReaction(message.id, reaction)}
                                >
                                  {reaction} {messageReactions[message.id]?.[reaction] || 0}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {/* Enhanced Typing Indicator */}
                  {isTyping && (
                    <div className="typing-indicator">
                      <div className={`bot-message ${darkMode ? 'dark' : ''}`}>
                        <div className="avatar">
                          <FaRobot />
                        </div>
                        <div className="message-content typing">
                          <div className="typing-dots">
                            <span></span>
                            <span></span>
                            <span></span>
                          </div>
                          <small className="text-muted">
                            AI is analyzing your request...
                          </small>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
              </Card.Body>

              {/* Enhanced Input Area */}
              <Card.Footer className={`chat-input ${darkMode ? 'bg-secondary' : 'bg-light'}`}>
                {/* Reply Indicator */}
                {replyTo && (
                  <div className="reply-preview mb-2 p-2 rounded" style={{backgroundColor: 'rgba(0,123,255,0.1)'}}>
                    <div className="d-flex justify-content-between align-items-start">
                      <small>
                        <FaReply className="me-1" />
                        Replying to: {replyTo.text.substring(0, 50)}...
                      </small>
                      <Button size="sm" variant="link" onClick={() => setReplyTo(null)}>
                        <FaTimes />
                      </Button>
                    </div>
                  </div>
                )}

                {/* File Uploads Preview */}
                {uploadedFiles.length > 0 && (
                  <div className="uploaded-files-preview mb-2">
                    <div className="d-flex flex-wrap gap-2">
                      {uploadedFiles.map((file, idx) => (
                        <div key={idx} className={`file-preview ${darkMode ? 'bg-dark' : 'bg-white'} p-2 rounded d-flex align-items-center`}>
                          <FaFileUpload className="me-2" />
                          <span className="file-name">{file.name}</span>
                          <small className="text-muted ms-2">({(file.size / 1024).toFixed(1)}KB)</small>
                          <Button 
                            size="sm" 
                            variant="outline-danger" 
                            className="ms-2 p-1"
                            onClick={() => setUploadedFiles(files => files.filter((_, i) => i !== idx))}
                          >
                            <FaTimes />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Smart Suggestions */}
                {showSuggestions && smartSuggestions.length > 0 && (
                  <div className="suggestions mb-2">
                    <small className="text-muted">💡 Suggestions:</small>
                    <div className="d-flex flex-wrap gap-1 mt-1">
                      {smartSuggestions.map((suggestion, idx) => (
                        <span
                          key={idx}
                          className="suggestion-pill"
                          onClick={() => {
                            setInputMessage(suggestion);
                            setShowSuggestions(false);
                          }}
                        >
                          {suggestion}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Main Input Group */}
                <InputGroup>
                  {/* File Upload Button */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileSelect}
                    accept=".json,.csv,.xlsx,.txt,.pdf,.doc,.docx,.png,.jpg,.jpeg"
                    multiple
                    style={{ display: 'none' }}
                  />
                  
                  <OverlayTrigger placement="top" overlay={<Tooltip>Upload Files</Tooltip>}>
                    <Button
                      variant={darkMode ? "outline-light" : "outline-secondary"}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <FaCloudUploadAlt />
                    </Button>
                  </OverlayTrigger>

                  {/* Voice Button */}
                  <OverlayTrigger 
                    placement="top" 
                    overlay={<Tooltip>{isRecording ? 'Stop Recording' : 'Voice Input'}</Tooltip>}
                  >
                    <Button
                      variant={isRecording || isListening ? "danger" : (darkMode ? "outline-light" : "outline-secondary")}
                      onClick={handleVoiceToggle}
                      className={isRecording || isListening ? 'pulse-animation' : ''}
                      disabled={!speechSupported}
                    >
                      {isRecording || isListening ? <FaMicrophoneSlash /> : <FaMicrophone />}
                    </Button>
                  </OverlayTrigger>

                  {/* Formatting Toggle */}
                  <OverlayTrigger placement="top" overlay={<Tooltip>Text Formatting</Tooltip>}>
                    <Button
                      variant={showFormatting ? "primary" : (darkMode ? "outline-light" : "outline-secondary")}
                      onClick={() => setShowFormatting(!showFormatting)}
                    >
                      <FaEdit />
                    </Button>
                  </OverlayTrigger>
                  
                  {/* Main Text Input */}
                  <Form.Control
                    ref={inputRef}
                    as="textarea"
                    rows={1}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                    placeholder="Type your message... (Ctrl+Enter to send, Ctrl+K to search)"
                    className={`chat-textarea ${darkMode ? 'bg-dark text-light' : ''}`}
                    style={{ 
                      resize: 'none',
                      minHeight: '45px',
                      maxHeight: '150px'
                    }}
                  />
                  
                  {/* Send Button */}
                  <OverlayTrigger placement="top" overlay={<Tooltip>Send (Ctrl+Enter)</Tooltip>}>
                    <Button
                      variant="primary"
                      onClick={handleSendMessage}
                      disabled={!inputMessage.trim() && uploadedFiles.length === 0}
                      className="send-button"
                    >
                      {isTyping ? <FaSpinner className="fa-spin" /> : <FaPaperPlane />}
                    </Button>
                  </OverlayTrigger>
                </InputGroup>

                {/* Formatting Tools */}
                {showFormatting && (
                  <div className="formatting-tools mt-2 p-2 rounded" style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
                    <div className="d-flex gap-2 align-items-center">
                      <small className="text-muted">Format:</small>
                      <Button 
                        size="sm" 
                        variant={textFormatting.bold ? "primary" : "outline-secondary"}
                        onClick={() => setTextFormatting(f => ({...f, bold: !f.bold}))}
                      >
                        <FaBold />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={textFormatting.italic ? "primary" : "outline-secondary"}
                        onClick={() => setTextFormatting(f => ({...f, italic: !f.italic}))}
                      >
                        <FaItalic />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={textFormatting.code ? "primary" : "outline-secondary"}
                        onClick={() => setTextFormatting(f => ({...f, code: !f.code}))}
                      >
                        <FaCode />
                      </Button>
                      <Button 
                        size="sm" 
                        variant={textFormatting.quote ? "primary" : "outline-secondary"}
                        onClick={() => setTextFormatting(f => ({...f, quote: !f.quote}))}
                      >
                        <FaQuoteLeft />
                      </Button>
                    </div>
                  </div>
                )}

                {/* Enhanced Quick Actions */}
                <div className="enhanced-quick-actions mt-3">
                  <div className="d-flex flex-wrap gap-2 align-items-center">
                    <small className="text-muted me-2">⚡ Quick:</small>
                    
                    <Button 
                      size="sm" 
                      variant="outline-primary"
                      onClick={() => setInputMessage('Show sentiment analysis dashboard')}
                    >
                      📊 Analytics
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline-success"
                      onClick={() => setInputMessage('Generate comprehensive summary report')}
                    >
                      📋 Report
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline-info"
                      onClick={() => exportChat('pdf')}
                    >
                      📄 Export
                    </Button>
                    
                    <Button 
                      size="sm" 
                      variant="outline-warning"
                      onClick={startNewChat}
                    >
                      ✨ New Chat
                    </Button>
                    
                    <Dropdown>
                      <Dropdown.Toggle size="sm" variant="outline-secondary">
                        More Actions <FaChevronDown />
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => setTranslationEnabled(!translationEnabled)}>
                          <FaGlobe className="me-2" />Toggle Translation
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowAnalytics(true)}>
                          <FaChartBar className="me-2" />View Analytics
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => setShowScheduler(true)}>
                          <FaClock className="me-2" />Schedule Message
                        </Dropdown.Item>
                        <Dropdown.Item onClick={clearChat}>
                          <FaTrash className="me-2" />Clear Chat
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </div>
                </div>

                {/* Status Bar */}
                <div className="status-bar mt-2 d-flex justify-content-between align-items-center">
                  <small className={`text-${speechSupported ? 'success' : 'warning'}`}>
                    {speechSupported ? 
                      '🎤 Voice ready' : 
                      '📼 Audio available'
                    } | 
                    {translationEnabled ? ' 🌐 Translation ON' : ''} |
                    Messages: {messages.length} |
                    Bookmarks: {bookmarkedMessages.length}
                  </small>
                  
                  <div className="d-flex gap-2">
                    <Badge bg="info" className="keyboard-hint">
                      Ctrl+/ for shortcuts
                    </Badge>
                    {uploadedFiles.length > 0 && (
                      <Badge bg="success">
                        {uploadedFiles.length} file(s) ready
                      </Badge>
                    )}
                  </div>
                </div>
              </Card.Footer>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Enhanced Settings Modal */}
      <Modal show={showSettings} onHide={() => setShowSettings(false)} size="lg" centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>⚙️ Enhanced Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          <Tabs defaultActiveKey="general" className="mb-3">
            {/* General Settings */}
            <Tab eventKey="general" title="🔧 General">
              <Form>
                <Form.Group className="mb-3">
                  <Form.Label>Language Preference</Form.Label>
                  <Form.Select 
                    value={language} 
                    onChange={(e) => setLanguage(e.target.value)}
                    className={darkMode ? 'bg-dark text-light' : ''}
                  >
                    <option value="en">English</option>
                    <option value="hi">हिंदी (Hindi)</option>
                    <option value="es">Español</option>
                    <option value="fr">Français</option>
                  </Form.Select>
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="🌙 Dark Mode"
                    checked={darkMode}
                    onChange={(e) => setDarkMode(e.target.checked)}
                  />
                </Form.Group>
                
                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="🔊 Voice Commands"
                    checked={speechSupported}
                    disabled
                  />
                  <small className="text-muted">
                    {speechSupported ? 'Available' : 'Requires compatible browser & internet'}
                  </small>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="🌐 Auto Translation"
                    checked={translationEnabled}
                    onChange={(e) => setTranslationEnabled(e.target.checked)}
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Check
                    type="switch"
                    label="♿ Accessibility Mode"
                    checked={accessibilityMode}
                    onChange={(e) => setAccessibilityMode(e.target.checked)}
                  />
                </Form.Group>
              </Form>
            </Tab>

            {/* Shortcuts Tab */}
            <Tab eventKey="shortcuts" title="⌨️ Shortcuts">
              <div className="keyboard-shortcuts">
                <h6>Keyboard Shortcuts</h6>
                {Object.entries(keyboardShortcuts).map(([key, description]) => (
                  <div key={key} className="d-flex justify-content-between mb-2 p-2 rounded" style={{backgroundColor: 'rgba(0,0,0,0.05)'}}>
                    <code>{key}</code>
                    <span>{description}</span>
                  </div>
                ))}
              </div>
            </Tab>

            {/* Export Tab */}
            <Tab eventKey="export" title="📤 Export">
              <div className="export-settings">
                <h6>Export Options</h6>
                <Form.Group className="mb-3">
                  <Form.Label>Default Export Format</Form.Label>
                  <Form.Select 
                    value={exportFormat} 
                    onChange={(e) => setExportFormat(e.target.value)}
                  >
                    <option value="pdf">PDF Document</option>
                    <option value="docx">Word Document</option>
                    <option value="excel">Excel Spreadsheet</option>
                    <option value="json">JSON Data</option>
                  </Form.Select>
                </Form.Group>
                
                <div className="export-actions mt-3">
                  <Button variant="primary" className="me-2" onClick={() => exportChat(exportFormat)}>
                    Export Current Chat
                  </Button>
                  <Button variant="outline-primary" onClick={() => exportChat('json')}>
                    Backup All Data
                  </Button>
                </div>
              </div>
            </Tab>
          </Tabs>
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setShowSettings(false)}>
            Close
          </Button>
          <Button variant="primary" onClick={() => {
            toast.success('⚙️ Settings saved!');
            setShowSettings(false);
          }}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Analytics Modal */}
      <Modal show={showAnalytics} onHide={() => setShowAnalytics(false)} size="lg" centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>📊 Chat Analytics</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          <Row>
            <Col md={6}>
              <div className="stats-card p-3 rounded mb-3" style={{backgroundColor: 'rgba(0,123,255,0.1)'}}>
                <h6>📈 Overall Stats</h6>
                <div>Total Messages: <strong>{chatStats.totalMessages}</strong></div>
                <div>Bookmarked: <strong>{bookmarkedMessages.length}</strong></div>
                <div>Files Uploaded: <strong>{messages.filter(m => m.files?.length > 0).length}</strong></div>
              </div>
            </Col>
            <Col md={6}>
              <div className="stats-card p-3 rounded mb-3" style={{backgroundColor: 'rgba(40,167,69,0.1)'}}>
                <h6>🎯 Engagement</h6>
                <div>Reactions: <strong>{Object.values(messageReactions).reduce((sum, reactions) => sum + Object.values(reactions).reduce((a,b) => a+b, 0), 0)}</strong></div>
                <div>Voice Commands: <strong>{messages.filter(m => m.isVoiceCommand).length || 0}</strong></div>
                <div>Exports: <strong>Available</strong></div>
              </div>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setShowAnalytics(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Sharing Modal */}
      <Modal show={isSharing} onHide={() => setIsSharing(false)} centered>
        <Modal.Header closeButton className={darkMode ? 'bg-dark text-light' : ''}>
          <Modal.Title>🤝 Share & Collaborate</Modal.Title>
        </Modal.Header>
        <Modal.Body className={darkMode ? 'bg-dark text-light' : ''}>
          <div className="sharing-options">
            <Button variant="outline-primary" className="w-100 mb-2">
              <FaLink className="me-2" />Generate Shareable Link
            </Button>
            <Button variant="outline-success" className="w-100 mb-2">
              <FaDownload className="me-2" />Download Chat Backup
            </Button>
            <Button variant="outline-info" className="w-100">
              <FaPrint className="me-2" />Print Conversation
            </Button>
          </div>
        </Modal.Body>
        <Modal.Footer className={darkMode ? 'bg-dark' : ''}>
          <Button variant="secondary" onClick={() => setIsSharing(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ChatInterface;
