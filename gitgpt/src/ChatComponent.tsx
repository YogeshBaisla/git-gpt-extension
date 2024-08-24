import React, { useState } from 'react';

// Define a type for the message objects
type Message = {
  text: string;
  response: any; // or replace 'any' with a more specific type if known
};

const ChatComponent: React.FC = () => {
  // Initialize messages state with the correct type
  const [messages, setMessages] = useState<Message[]>([]); // An array of Message type
  const [input, setInput] = useState<string>(''); // Input state of type string

  const handleSend = async () => {
    // Example API call - replace with your actual API call
    const response = await fetch('/api/convert-to-git', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query: input })
    });

    const data = await response.json();
    
    // Update the messages state correctly with the new message
    setMessages([...messages, { text: input, response: data.commands }]);
    setInput('');
  };

  return (
    <div>
      <div id="chat-messages">
        {messages.map((message, index) => (
          <div key={index}>
            <p>User: {message.text}</p>
            <p>AI: {message.response.join('\n')}</p>
          </div>
        ))}
      </div>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <button onClick={handleSend}>Send</button>
    </div>
  );
};

export default ChatComponent;
