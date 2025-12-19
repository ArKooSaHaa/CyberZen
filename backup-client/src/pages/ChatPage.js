import React from 'react';
import ChatBox from '../components/ChatBox';
import NavigationBar from '../components/NavigationBar'; // Assuming you have a Navbar

const ChatPage = () => {
  return (
    <div>
      <NavigationBar />
      <ChatBox />
    </div>
  );
};

export default ChatPage;
