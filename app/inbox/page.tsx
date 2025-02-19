"use client"

import { useState } from "react"
import { format } from "date-fns"
import { Mail, Star, Send, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

// Generate 30 mock messages
const generateMockMessages = () => {
  const messages = []
  for (let i = 1; i <= 30; i++) {
    messages.push({
      id: i,
      from: `User${i}@example.com`,
      subject: `Subject ${i}`,
      message: `This is the content of message ${i}. It's a sample message for testing pagination and conversation history.`,
      timestamp: new Date(2023, 4, i).toISOString(),
      status: i % 3 === 0 ? "unread" : "read",
      isStarred: i % 5 === 0,
      conversation: [],
    })
  }
  return messages
}

const mockMessages = generateMockMessages()

export default function InboxPage() {
  const [messages, setMessages] = useState(mockMessages)
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [isReplying, setIsReplying] = useState(false)
  const [replyText, setReplyText] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const messagesPerPage = 20

  const toggleStarred = (id) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, isStarred: !msg.isStarred } : msg)))
  }

  const markAsRead = (id) => {
    setMessages(messages.map((msg) => (msg.id === id ? { ...msg, status: "read" } : msg)))
  }

  const handleReply = () => {
    setIsReplying(true)
  }

  const handleSendReply = () => {
    if (replyText.trim() === "") return

    const newReply = {
      from: "Support Team",
      message: replyText,
      timestamp: new Date().toISOString(),
    }

    setMessages(
      messages.map((msg) =>
        msg.id === selectedMessage.id ? { ...msg, conversation: [...msg.conversation, newReply] } : msg,
      ),
    )

    setSelectedMessage({
      ...selectedMessage,
      conversation: [...selectedMessage.conversation, newReply],
    })

    setIsReplying(false)
    setReplyText("")
  }

  const indexOfLastMessage = currentPage * messagesPerPage
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage
  const currentMessages = messages.slice(indexOfFirstMessage, indexOfLastMessage)

  const totalPages = Math.ceil(messages.length / messagesPerPage)

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>
      <div className="mb-4">
        <Input type="text" placeholder="Search messages..." className="w-full" />
      </div>
      <div className="space-y-2 mb-4">
        {currentMessages.map((message) => (
          <div
            key={message.id}
            className={`flex items-center p-3 rounded cursor-pointer ${
              message.status === "unread" ? "bg-blue-50" : "bg-white"
            } hover:bg-gray-100`}
            onClick={() => {
              setSelectedMessage(message)
              markAsRead(message.id)
            }}
          >
            <Button
              variant="ghost"
              size="sm"
              className="mr-2"
              onClick={(e) => {
                e.stopPropagation()
                toggleStarred(message.id)
              }}
            >
              <Star className={`h-4 w-4 ${message.isStarred ? "text-yellow-400 fill-yellow-400" : "text-gray-400"}`} />
            </Button>
            <div className="flex-grow">
              <div className="flex justify-between">
                <span className={`font-semibold ${message.status === "unread" ? "text-black" : "text-gray-600"}`}>
                  {message.from}
                </span>
                <span className="text-sm text-gray-500">{format(new Date(message.timestamp), "MMM d, h:mm a")}</span>
              </div>
              <div className="text-sm text-gray-600 truncate">{message.subject}</div>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between items-center">
        <Button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          <ChevronLeft className="h-4 w-4 mr-2" /> Previous
        </Button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <Button
          onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
          disabled={currentPage === totalPages}
        >
          Next <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>
      {selectedMessage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
              <Button
                variant="ghost"
                onClick={() => {
                  setSelectedMessage(null)
                  setIsReplying(false)
                  setReplyText("")
                }}
              >
                Close
              </Button>
            </div>
            <div className="mb-4">
              <p>
                <strong>From:</strong> {selectedMessage.from}
              </p>
              <p>
                <strong>Date:</strong> {format(new Date(selectedMessage.timestamp), "MMM d, yyyy h:mm a")}
              </p>
            </div>
            <div className="border-t pt-4">
              <p>{selectedMessage.message}</p>
            </div>
            {selectedMessage.conversation.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-bold mb-2">Conversation History:</h4>
                {selectedMessage.conversation.map((reply, index) => (
                  <div key={index} className="mb-2">
                    <p>
                      <strong>{reply.from}:</strong> {reply.message}
                    </p>
                    <p className="text-sm text-gray-500">{format(new Date(reply.timestamp), "MMM d, yyyy h:mm a")}</p>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-6">
              {!isReplying ? (
                <Button className="mr-2" onClick={handleReply}>
                  <Mail className="mr-2 h-4 w-4" /> Reply
                </Button>
              ) : (
                <div className="space-y-4">
                  <Textarea
                    placeholder="Type your reply here..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    rows={4}
                  />
                  <div className="flex justify-end space-x-2">
                    <Button variant="outline" onClick={() => setIsReplying(false)}>
                      Cancel
                    </Button>
                    <Button onClick={handleSendReply}>
                      <Send className="mr-2 h-4 w-4" /> Send Reply
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

