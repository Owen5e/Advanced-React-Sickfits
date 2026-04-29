import PropTypes from 'prop-types';
import { useState } from 'react';
import { useCart } from '../lib/cartState';

export default function AISearch({ onResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { cartOpen } = useCart();

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

      const products = await res.json();

      console.log('Search results:', products);

      // Pass products to parent
      onResults(products);

      // Add AI response message
      const count = products.length;
      setMessages(prev => [
        ...prev,
        {
          text: `Found ${count} product${count !== 1 ? 's' : ''} matching "${query}"`,
          type: 'ai',
          products
        }
      ]);
    } catch (err) {
      console.error('Search failed', err);
      setMessages(prev => [...prev, { text: 'Search failed. Try again.', type: 'ai' }]);
    }

    setLoading(false);
    setQuery('');
  }

  // Hide AISearch when cart is open
  if (cartOpen) {
    return null;
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-primary text-white rounded-full shadow-lg flex items-center justify-center z-40 hover:bg-primary-dark transition-colors"
        aria-label={isOpen ? 'Close AI search' : 'Open AI search'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
            />
          </svg>
        )}
      </button>

      {/* AI Search Chat Box - Only shown when isOpen is true */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 w-120 h-100 bg-white border border-neutral-300 rounded-xl shadow-lg flex flex-col z-40">
          {/* Header */}
          <div className="px-4 py-3 border-b border-neutral-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <svg
                  className="w-4 h-4 text-primary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-neutral-800">AI Search Assistant</h3>
                <p className="text-xs text-neutral-500">Ask for product recommendations</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 text-neutral-500"
              aria-label="Close"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center text-neutral-500">
                <svg
                  className="w-10 h-10 mb-3 text-neutral-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                  />
                </svg>
                <p className="text-sm font-medium text-neutral-700 mb-1">How can I help you?</p>
                <p className="text-xs text-neutral-500">
                  Try asking for specific products or filters
                </p>
                <div className="mt-4 space-y-2">
                  <button
                    onClick={() => setQuery('Show me red shoes under $50')}
                    className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                  >
                    "Show me red shoes under $50"
                  </button>
                  <button
                    onClick={() => setQuery('Find comfortable running shoes')}
                    className="text-xs px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg transition-colors"
                  >
                    "Find comfortable running shoes"
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                {messages.map((msg, idx) => (
                  <div key={idx}>
                    <div
                      className={`max-w-[80%] p-3 rounded-lg break-words whitespace-normal ${
                        msg.type === 'user'
                          ? 'ml-auto bg-primary text-white rounded-br-none'
                          : 'bg-neutral-100 text-neutral-800 rounded-bl-none'
                      }`}
                    >
                      {msg.text}
                    </div>
                    {msg.products && msg.products.length > 0 && (
                      <div className="mt-2 max-w-[90%] space-y-2">
                        {msg.products.slice(0, 3).map(product => (
                          <div
                            key={product.id}
                            className="bg-neutral-50 p-2 rounded border border-neutral-200 text-xs"
                          >
                            <p className="font-medium text-neutral-800">{product.name}</p>
                            <p className="text-neutral-600 line-clamp-2">{product.description}</p>
                            <p className="text-primary font-semibold mt-1">
                              ${(product.price / 100).toFixed(2)}
                            </p>
                          </div>
                        ))}
                        {msg.products.length > 3 && (
                          <p className="text-xs text-neutral-500 italic">
                            +{msg.products.length - 3} more products
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
                {loading && (
                  <div className="bg-neutral-100 text-neutral-800 p-3 rounded-lg rounded-bl-none max-w-[80%]">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"></div>
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0.2s' }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-neutral-400 rounded-full animate-pulse"
                        style={{ animationDelay: '0.4s' }}
                      ></div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Input area */}
          <div className="w-full border-t border-neutral-300 p-4">
            <div className="flex space-x-2 w-full">
              <input
                type="text"
                placeholder="Ask AI to search..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                className="flex-1 min-w-0 px-4 py-2 border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-sm"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-4 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
              >
                {loading ? '...' : 'Send'}
              </button>
            </div>
            <p className="text-xs text-neutral-500 mt-2 text-center">AI-powered product search</p>
          </div>
        </div>
      )}
    </>
  );
}

AISearch.propTypes = {
  onResults: PropTypes.func.isRequired
};
