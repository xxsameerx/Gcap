import React from 'react';
import { Badge } from 'react-bootstrap';
import { FaUser, FaRobot, FaFileAlt } from 'react-icons/fa';

const MessageBubble = ({ message }) => {
  const isBot = message.sender === 'bot';
  const isWelcome = message.type === 'welcome';

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`message-bubble ${isBot ? 'bot-message' : 'user-message'} ${isWelcome ? 'welcome-message' : ''}`}>
      <div className="avatar">
        {isBot ? <FaRobot /> : <FaUser />}
      </div>
      
      <div className="message-content">
        {message.file && (
          <div className="file-attachment mb-2">
            <FaFileAlt className="me-2" />
            <span>{message.file.name}</span>
            <Badge bg="info" className="ms-2">
              {(message.file.size / 1024).toFixed(1)} KB
            </Badge>
          </div>
        )}
        
        <div className="message-text">
          {message.text.split('\n').map((line, index) => (
            <React.Fragment key={index}>
              {line}
              {index < message.text.split('\n').length - 1 && <br />}
            </React.Fragment>
          ))}
        </div>
        
        <div className="message-timestamp">
          {formatTimestamp(message.timestamp)}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
