import React, { useEffect } from 'react';
import ChatInterface from '../components/chatbot/ChatInterface';
import '../components/chatbot/ChatInterface.css';

const ChatBotPage = () => {
  useEffect(() => {
    // Hide footer when component mounts
    const footer = document.querySelector('footer');
    if (footer) {
      footer.style.display = 'none';
    }

    // Show footer when component unmounts
    return () => {
      const footer = document.querySelector('footer');
      if (footer) {
        footer.style.display = 'block';
      }
    };
  }, []);

  return (
    <div className="chatbot-page">
      <ChatInterface />
    </div>
  );
};

export default ChatBotPage;
