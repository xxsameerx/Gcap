// import React, { useState } from 'react';
import { Badge, Button, Dropdown } from 'react-bootstrap';
import { FaUser, FaRobot, FaFileAlt, FaCopy, FaBookmark, FaThumbsUp, FaThumbsDown, FaShare, FaDownload } from 'react-icons/fa';
import React, { useState } from 'react';
const MessageBubble = ({ message, darkMode, onCopy, onBookmark }) => {
  const [showActions, setShowActions] = useState(false);
  const isBot = message.sender === 'bot';
  const isWelcome = message.type === 'welcome';

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    onCopy?.();
  };

  const handleBookmark = () => {
    onBookmark?.(message);
  };

  return (
    <div 
      className={`message-bubble ${isBot ? 'bot-message' : 'user-message'} ${isWelcome ? 'welcome-message' : ''} ${darkMode ? 'dark' : 'light'}`}
      onMouseEnter={() => setShowActions(true)}
      onMouseLeave={() => setShowActions(false)}
    >
      <div className="avatar">
        {isBot ? <FaRobot /> : <FaUser />}
      </div>
      
      <div className="message-content">
        {/* File Attachment */}
        {message.file && (
          <div className="file-attachment mb-2">
            <div className="d-flex align-items-center">
              <FaFileAlt className="me-2 text-primary" />
              <span className="file-name">{message.file.name}</span>
              <Badge bg="info" className="ms-2">
                {(message.file.size / 1024).toFixed(1)} KB
              </Badge>
            </div>
          </div>
        )}
        
        {/* Message Text with Enhanced Formatting */}
        <div className="message-text">
          {message.text.split('\n').map((line, index) => {
            // Enhanced formatting for bullet points and headings
            if (line.startsWith('•')) {
              return (
                <div key={index} className="bullet-point">
                  <span className="bullet">•</span>
                  <span className="bullet-text">{line.substring(1).trim()}</span>
                </div>
              );
            } else if (line.startsWith('**') && line.endsWith('**')) {
              return (
                <div key={index} className="message-heading">
                  {line.replace(/\*\*/g, '')}
                </div>
              );
         } else if (line.includes('```')) {
  return (
    <div key={index} className="code-block">
      <code>{line.replace(/```/g, '')}</code>
    </div>
  );
}
            return (
              <React.Fragment key={index}>
                {line}
                {index < message.text.split('\n').length - 1 && <br />}
              </React.Fragment>
            );
          })}
        </div>

        {/* Confidence Score for Bot Messages */}
        {isBot && message.confidence && (
          <div className="confidence-indicator">
            <small className="text-muted">
              Confidence: {(message.confidence * 100).toFixed(1)}%
            </small>
          </div>
        )}

        {/* Suggested Actions */}
        {message.suggestions && message.suggestions.length > 0 && (
          <div className="message-suggestions">
            {message.suggestions.map((suggestion, index) => (
              <span key={index} className="suggestion-pill">
                {suggestion}
              </span>
            ))}
          </div>
        )}
        
        {/* Timestamp and Actions */}
        <div className="message-footer d-flex justify-content-between align-items-center mt-2">
          <div className="message-timestamp">
            {formatTimestamp(message.timestamp)}
          </div>
          
          {/* Message Actions */}
          {showActions && (
            <div className="message-actions d-flex gap-1">
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleCopy}
                title="Copy message"
              >
                <FaCopy />
              </Button>
              <Button
                variant="outline-secondary"
                size="sm"
                onClick={handleBookmark}
                title="Bookmark message"
              >
                <FaBookmark />
              </Button>
              {isBot && (
                <>
                  <Button
                    variant="outline-success"
                    size="sm"
                    title="Helpful"
                  >
                    <FaThumbsUp />
                  </Button>
                  <Button
                    variant="outline-danger"
                    size="sm"
                    title="Not helpful"
                  >
                    <FaThumbsDown />
                  </Button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
