import { useRouter } from 'next/router';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { useCart } from '../lib/cartState';

export default function AISearch({ onResults }) {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const { cartOpen } = useCart();
  const router = useRouter();

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
        className="fixed bottom-6 right-6 px-2 h-14 bg-[#16140f] text-white rounded-3xl shadow-lg flex items-center justify-center z-40 hover:bg-primary-dark transition-colors"
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
          <div className="flex gap-1 items-center ">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="10"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ff4a17"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="lucide lucide-astroid-icon lucide-astroid"
            >
              <path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203" />
            </svg>
            <text className=" text-[12px]  ">ASK STYLIST</text>
          </div>
        )}
      </button>

      {/* AI Search Chat Box - Only shown when isOpen is true */}
      {isOpen && (
        <div className="fixed bottom-24 right-6 max-w-120 h-100 bg-[#f4f1ea] border border-neutral-300 rounded-xl shadow-lg flex flex-col z-40">
          {/* Header */}
          <div className="px-2 py-2 border-b border-neutral-300 flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-[#16140f] rounded-xl flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#ff4a17"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  class="lucide lucide-astroid-icon lucide-astroid"
                >
                  <path d="M12.983 21.186a1 1 0 0 1-1.966 0 10 10 0 0 0-8.203-8.203 1 1 0 0 1 0-1.966 10 10 0 0 0 8.203-8.203 1 1 0 0 1 1.966 0 10 10 0 0 0 8.203 8.203 1 1 0 0 1 0 1.966 10 10 0 0 0-8.203 8.203" />
                </svg>
              </div>
              <div>
                <h3 className="font-semibold text-[#16140f]">Stylist</h3>
                <p className="text-xs text-neutral-500 ">
                  AI concierge
                  <span className="px-1">.</span>
                  online
                </p>
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
          <div className="flex-1 px-2 py-4 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col  space-y-2 ">
                <h3 className="w-[150px] text-[#16140f] font-bold text-[22px] ">
                  What are you <span className="text-[#ff4a17] ">looking for?</span>
                </h3>
                <p className="text-xs font-mono  text-[#807A6C] word-spacing:1rem ">
                  Describe a vibe, a budget, or a brand.
                </p>
                <div className="flex flex-col space-y-2">
                  <div className="px-2 py-1 border border-black rounded-md bg-transparent hover:bg-white flex items-center ">
                    <button
                      onClick={() => setQuery('Mad game pro shoes')}
                      className="text-start text-sm  text-neutral-700  transition-colors"
                    >
                      Show me mad game pro shoes
                    </button>
                  </div>
                  <div className="px-2 py-1 border border-black rounded-md bg-transparent hover:bg-white flex items-center ">
                    <button
                      onClick={() => setQuery('shoes under $500')}
                      className="text-start text-sm  text-neutral-700  transition-colors"
                    >
                      shoes under $500
                    </button>
                  </div>
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
                            onClick={() => router.push(`/product/${product.id}`)}
                            className="bg-neutral-50 p-2 rounded border border-neutral-200 text-xs cursor-pointer hover:bg-neutral-100 hover:border-primary hover:shadow-md transition-all"
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
          <div className="w-full border-t border-neutral-300 p-2">
            <div className="flex px-1 py-1 bg-white w-full border border-neutral-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent">
              <input
                type="text"
                placeholder="Describe what you want..."
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyPress={e => e.key === 'Enter' && handleSearch()}
                className=" w-full text-sm focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={handleSearch}
                disabled={loading || !query.trim()}
                className="px-2 py-2 bg-primary text-white font-medium rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap text-sm"
              >
                {loading ? (
                  '...'
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    class="lucide lucide-arrow-right-icon lucide-arrow-right"
                  >
                    <path d="M5 12h14" />
                    <path d="m12 5 7 7-7 7" />
                  </svg>
                )}
              </button>
            </div>
            <p className="text-xs font-mono  text-[#807A6C] mt-2 text-center">
              Tap a result to drop it in your bag
            </p>
          </div>
        </div>
      )}
    </>
  );
}

AISearch.propTypes = {
  onResults: PropTypes.func.isRequired
};
