//src/components/Chat.js
import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';





const socket = io('http://localhost:5000');

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  
  // Voor nu gebruiken we vaste waarden voor room en sender. Later kun je deze dynamisch maken.
  const roomId = 'room1';
  const senderId = 1;

  useEffect(() => {
    // Laat de client de kamer joinen zodra de component laadt.
    socket.emit('joinRoom', roomId);

    // Luister naar inkomende berichten.
    socket.on('chat message', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    // Ruim de event listener op bij unmount.
    return () => {
      socket.off('chat message');
    };
  }, [roomId]);

  const sendMessage = () => {
    if (input.trim() !== '') {
      socket.emit('chat message', { roomId, senderId, message: input });
      setInput('');
    }
  };

  return (
    <div style={{ margin: '20px' }}>
      <h2>Chat Room: {roomId}</h2>
      <div style={{ border: '1px solid #ccc', padding: '1rem', height: '300px', overflowY: 'scroll' }}>
        {messages.length === 0 && <p>Geen berichten ontvangen...</p>}
        {messages.map((msg, idx) => (
          <div key={idx}>
            <strong>{msg.senderId === senderId ? 'Ik' : 'Partner'}:</strong> {msg.message}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px' }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Typ je bericht..."
          style={{ width: '70%', padding: '8px' }}
        />
        <button onClick={sendMessage} style={{ padding: '8px 16px', marginLeft: '10px' }}>
          Verstuur
        </button>
      </div>
    </div>
  );
};

export default Chat;
