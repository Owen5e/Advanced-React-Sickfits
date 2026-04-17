import PropTypes from 'prop-types';
import { useState } from 'react';
import styled from 'styled-components';

const ChatBox = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 300px;
  height: 200px;
  background: white;
  border: 1px solid #ccc;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  z-index: 1000;
`;

const Messages = styled.div`
  flex: 1;
  padding: 10px;
  overflow-y: auto;
`;

const Message = styled.div`
  margin-bottom: 10px;
  padding: 8px;
  border-radius: 5px;
  background: #f1f1f1;
`;

const InputArea = styled.div`
  display: flex;
  gap: 10px;
  width: 100%;
  padding: 10px;
  border-top: 1px solid #ccc;
`;

const Input = styled.input`
  width: 100%;
  padding: 4px;
  border: 1px solid #ccc;
  border-radius: 5px;
`;

const Button = styled.button`
  padding: 2px 8px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  &:disabled {
    background: #ccc;
  }
`;

export default function AISearch({ onResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);

  async function handleSearch() {
    if (!query.trim()) return;

    setMessages(prev => [...prev, { text: query, type: 'user' }]);
    setLoading(true);

    try {
      const res = await fetch('/api/ai-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });

      const filters = await res.json();

      console.log('AI Filters:', filters);

      // Pass filters to parent
      onResults(filters);

      // Add AI response message
      setMessages(prev => [...prev, { text: `Applied filters for "${query}"`, type: 'ai' }]);
    } catch (err) {
      console.error('Search failed', err);
      setMessages(prev => [...prev, { text: 'Search failed. Try again.', type: 'ai' }]);
    }

    setLoading(false);
    setQuery('');
  }

  return (
    <ChatBox>
      <Messages>
        {messages.map((msg, idx) => (
          <Message
            key={idx}
            style={{
              alignSelf: msg.type === 'user' ? 'flex-end' : 'flex-start',
              background: msg.type === 'user' ? '#007bff' : '#f1f1f1',
              color: msg.type === 'user' ? 'white' : 'black'
            }}
          >
            {msg.text}
          </Message>
        ))}
        {loading && <Message>Loading...</Message>}
      </Messages>
      <InputArea>
        <Input
          type="text"
          placeholder="Ask AI to search..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleSearch()}
        />
        {/* eslint-disable-next-line */}
        <Button onClick={handleSearch} disabled={loading}>
          Send
        </Button>
      </InputArea>
    </ChatBox>
  );
}

AISearch.propTypes = {
  onResults: PropTypes.func.isRequired
};
