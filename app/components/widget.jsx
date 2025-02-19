"use client"
import { useState } from "react";
import { MessageSquare } from "lucide-react"; // ✅ Correct Chat Icon

export default function ChatbotWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "bot", content: "Hello! How can I assist you today?" },
  ]);
  const [input, setInput] = useState("");
  const [isWaiting, setIsWaiting] = useState(false);

  const toggleChat = () => setIsOpen(!isOpen);

  const sendMessage = async () => {
    if (!input.trim() || isWaiting) return;

    const userMessage = { sender: "user", content: input.trim() };
    setMessages([...messages, userMessage]);
    setInput("");
    setIsWaiting(true);

    try {
      const response = await fetch("https://n8n.meerkatcoding.com/webhook/e6ccc150-97d8-45b8-9129-cf5949d5f0ac", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage.content }),
      });
      const data = await response.json();
      setMessages([...messages, userMessage, { sender: "bot", content: data.response || "Error connecting to server." }]);
    } catch {
      setMessages([...messages, userMessage, { sender: "bot", content: "Error connecting to server." }]);
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <>
      {/* ✅ Floating Chat Icon (Locked to Bottom-Right) */}
      {!isOpen && (
        <button
          className="fixed bottom-5 right-5 bg-purple-700 text-white rounded-full shadow-lg hover:bg-purple-800 transition duration-300 flex items-center justify-center"
          style={{
            width: "60px",
            height: "60px",
            zIndex: 9999, // ✅ Ensures it's on top
            position: "fixed",
            bottom: "20px",
            right: "20px",
          }}
          onClick={toggleChat}
        >
          <MessageSquare size={32} strokeWidth={2} />
        </button>
      )}

      {/* ✅ Chat Window (Properly Fixed at Bottom-Right) */}
      {isOpen && (
        <div
          className="fixed bottom-5 right-5 w-80 bg-white rounded-lg shadow-lg border border-gray-300 flex flex-col"
          style={{
            height: "450px",
            maxHeight: "80vh",
            position: "fixed",
            bottom: "20px",
            right: "20px",
            zIndex: 9999,
          }}
        >
          {/* Chat Header */}
          <div
            className="bg-purple-700 text-white text-center py-3 font-bold cursor-pointer flex justify-between px-4"
            onClick={toggleChat}
          >
            <span>Chatbot</span>
            <button className="text-white text-lg">✖</button>
          </div>

          {/* Chat Messages */}
          <div className="flex-1 p-3 overflow-y-auto">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`p-2 rounded-lg max-w-[70%] ${msg.sender === "user" ? "bg-purple-700 text-white" : "bg-gray-200"}`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="p-2 border-t bg-white flex items-center">
            <input
              className="flex-grow p-2 border rounded"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Type a message..."
              disabled={isWaiting}
            />
            <button
              className="ml-2 bg-purple-700 text-white px-3 py-1 rounded"
              onClick={sendMessage}
              disabled={isWaiting}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
