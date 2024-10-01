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
      const API_KEY = 'AIzaSyB6SD8rYS-VGRJlQHepvK2iFo1ULrn82GE'; // Replace with your actual Google API key
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`;
      
      const res = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: input }] }],
      }),
    });

     const data = await res.json();
      setConversation((prev) => [...prev, { sender: 'ai', message: data?.candidates[0]?.content?.parts[0]?.text}]);
    }
    catch (error) {
      console.error('Error fetching content:', error);
      setConversation((prev) => [...prev, { sender: 'ai', message: 'Error generating content.' }]);
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
        <h1 className="text-center text-white text-2xl font-extrabold">Ai Chat Assistant 1.0</h1>
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
        <form onSubmit={handleGenerate} className="flex justify-between">
          <textarea
            type="text" 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            className="rounded-2xl py-2 px-3 w-8/12 border-2 border-bg-indigo-500" >
            </textarea>
            
           <button type="submit" className="bg-blue-800 py-3 px-4 text-xl rounded-2xl text-white z-10">
            Send <FaPaperPlane className="inline" />
          </button>
        </form>
      </footer>
    </>
  );
}

export default App;
