import { useState, useEffect, useRef } from 'react'
import { FaPaperPlane, FaRobot, FaCopy, FaVolumeUp, FaShareAlt } from 'react-icons/fa'
import ReactMarkdown from 'react-markdown'
import loadingGif from '/loading.gif'

const App = () => {
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [conversation, setConversation] = useState([])
  const chatContainerRef = useRef(null)
   
  
  const handleGenerate = async (e) => {
    e.preventDefault()

    if (!input.trim()) {
      alert('Please type in a prompt')
      return
    }

    setConversation((prev) => [...prev, { sender: 'user', message: input }])
    setLoading(true)

    try {
      const API_KEY = 'AIzaSyB6SD8rYS-VGRJlQHepvK2iFo1ULrn82GE'
      const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${API_KEY}`
      
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [{ role: "user", parts: [{ text: input }] }],
        }),
      })

      const data = await res.json()
      setConversation((prev) => [...prev, { sender: 'ai', message: data?.candidates[0]?.content?.parts[0]?.text}])
    } catch (error) {
      console.error('Error fetching content:', error)
      setConversation((prev) => [...prev, { sender: 'ai', message: 'Error generating content.' }])
    } finally {
      setLoading(false)
    }
   
    setInput('')
  }

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [conversation])

  return (
    <>
      <header className="bg-black fixed top-0 w-full text-white p-5 z-10 flex justify-center items-center">
        <FaRobot className="mr-2 text-2xl font-extrabold"/>
        <h1 className="text-center text-white text-2xl font-extrabold">  
        Chat Assistant </h1>
      </header>
      
      <div id="container" className="pt-16 pb-16 px-5 w-full mb-15">
        <div ref={chatContainerRef} className="mb-48">
          <div className="bg-purple-700 text-white rounded-bl-2xl max-full p-2 mt-5">
            <p>My name is Ai,<br />think of me like an assistant<br />who is here to help you,<br />plan, learn, and connect.<br />What can I help you with today?</p>
          </div>
          {conversation.map((chat, index) => {
            const isUserMessage = chat.sender === 'user'
            const isAIMessage = chat.sender === 'ai'

            return (
              <div key={index} className={isUserMessage ? 'bg-gray-800 text-white rounded-tr-2xl w-fit max-w-[70%] p-2 text-white mt-7 ml-auto' : 'bg-purple-700 text-white rounded-bl-2xl w-full p-2 mt-5'}>
                {isAIMessage ? (
                <>
                <ReactMarkdown className="prose prose-sm overflow-x-auto">
                    {chat.message} 
                  </ReactMarkdown>
                 <FaCopy className="text-white inline text-2xl mt-4" onClick={() => navigator.clipboard.writeText(chat.message)}/>
                 <FaVolumeUp className="inline mt-4 text-2xl text-white ml-3" onClick={() => {
                  const speech = new SpeechSynthesisUtterance(chat.message);
                  speech.volume = 1; 
                  speech.rate = 1;
                  speechSynthesis.speak(speech);
                 }}/>
                 <FaShareAlt className="inline text-white mt-4 ml-3 text-2xl" onClick={() => {
                 const shareData = {
                 title: 'Chat Assistant',
                 text: chat.message,
                 url: "https://ai-chat-assistant-nu.vercel.app/",
};
                 navigator.share(shareData)}}/>
                  </>
                  ) : (
                  <p>{chat.message}</p>
                )}
              </div>
          )
          })}
          {loading && <img src={loadingGif} alt="Loading..." className="transform translate-x-[-50px]" />}
        </div>
      </div>

      <footer className="p-5 fixed bottom-0 w-full">
        <form onSubmit={handleGenerate}>
          <textarea
            value={input} 
            placeholder="New Message"
            onChange={(e) => setInput(e.target.value)} 
            className="relative rounded-2xl pt-2 pl-3 pr-36 w-full border-4 border-amber" 
          />

        <button type="submit" className="absolute top-6 right-6 bg-purple-800 py-3 px-4 text-xl rounded-2xl text-white z-10">
            Send <FaPaperPlane className="inline" />
          </button>
        </form>
      </footer>
    </>
  )
}

export default App
