import { useState, useEffect, useRef } from 'react';
import { FaPaperPlane, FaRobot, FaCopy } from 'react-icons/fa';
import loadingGif from '/loading.gif';

const App = () => {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [conversation, setConversation] = useState([]);
  const chatContainerRef = useRef(null);

  const handleGenerate = async (e) => {
    e.preventDefault();

    if (!input.trim()) {
      alert('Please type in a prompt');
      return;
    }

    setConversation((prev) => [...prev, { sender: 'user', message: input }]);
    setLoading(true);

    try {
      const res = await fetch('http://localhost:3000/generate-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: input }),
      });

      const data = await res.json();
      setConversation((prev) => [...prev, { sender: 'ai', message: data.response }]);
    } catch (error) {
      console.error('Error fetching content:', error);
    } finally {
      setLoading(false);
    }

    setInput('');
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [conversation]);

  return (
    <>
      <header className="fixed top-0 w-full bg-blue-800 p-5 z-10">
        <h1 className="text-center text-white text-2xl font-extrabold">ChatBot</h1>
      </header>
      
      <div id="container" className="pt-16 pb-16 px-5 w-full mb-15">
        <h2 className="flex items-center text-2xl mt-5 font-bold">
          <FaRobot className="mr-2"/>
          Chat Assistant 
        </h2>

        <div ref={chatContainerRef} className="overflow-y-auto h-[calc(100vh-200px)]">
          <div className="bg-gray-300 rounded-bl-2xl w-fit max-w-[70%] p-2 mt-5">
            <p>My name is Ai,<br />think of me like an assistant<br />who is here to help you,<br />plan, learn, and connect.<br />What can I help you with today?</p>
          </div>
          {conversation.map((chat, index) => {
            const isUserMessage = chat.sender === 'user';
            const isAIMessage = chat.sender === 'ai';
            const messageContent = isAIMessage && /`([^`]+)`/.test(chat.message)
              ? (
                <pre className="bg-gray-800 text-white p-2 rounded-lg overflow-auto">
                  <code>
                    <FaCopy onClick={() => navigator.clipboard.writeText(chat.message)} className="text-2xl float-right cursor-pointer" />
                    {chat.message.replace(/`([^`]+)`/g, '$1')}
                  </code>
                </pre>
              )
              : <p>{chat.message}</p>;

            return (
              <div key={index} className={isUserMessage ? 'bg-blue-800 rounded-tr-2xl w-fit max-w-[70%] p-2 text-white mt-7 ml-auto' : 'bg-gray-300 rounded-bl-2xl w-fit max-w-[70%] p-2 mt-5'}>
                {messageContent}
              </div>
            );
          })}
          {loading && <img src={loadingGif} alt="Loading..." className="transform translate-x-[-50px]" />}
        </div>
      </div>

      <footer className="p-5 fixed bottom-0 w-full">
        <form onSubmit={handleGenerate} className="relative">
          <input 
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="New message" 
            className="rounded-2xl relative p-5 w-full border-2 border-black" 
          />
          <button type="submit" className="bg-blue-800 py-4 px-4 text-xl rounded-2xl text-white absolute top-1 right-0 z-10">
            Send <FaPaperPlane className="inline" />
          </button>
        </form>
      </footer>
    </>
  );
}

export default App;
