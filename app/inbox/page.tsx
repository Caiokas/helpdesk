"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Trash2, Mail, Star, Send, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

// ✅ Fetch Tickets from Supabase API
const fetchTicketsFromAPI = async (setMessages) => {
  try {
    const response = await fetch("/api/create-ticket");

    if (!response.ok) {
      throw new Error(`❌ API request failed with status: ${response.status}`);
    }

    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("❌ Invalid response format: Expected JSON but got something else");
    }

    const data = await response.json();

    if (data.success && Array.isArray(data.tickets)) {
      setMessages(data.tickets);
    } else {
      console.warn("❌ API returned no tickets");
    }
  } catch (error) {
    console.error("❌ Failed to fetch tickets:", error);
  }
};

export default function InboxPage() {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [status, setStatus] = useState("");

  useEffect(() => {
    fetchTicketsFromAPI(setMessages);
    const interval = setInterval(() => fetchTicketsFromAPI(setMessages), 5000);
    return () => clearInterval(interval);
  }, []);

  const openTicket = (message) => {
    setSelectedMessage(message);
    setStatus(message.status);
  };

  const closeTicket = (e) => {
    if (e.target.id === "ticketModal") {
      setSelectedMessage(null);
    }
  };

  const updateTicketStatus = async (id, newStatus) => {
    if (!id) {
      console.error("❌ Missing ticket ID.");
      return;
    }

    try {
      const response = await fetch("/api/update-ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: newStatus }),
      });

      const result = await response.json();
      if (result.success) {
        setMessages(messages.map((msg) =>
          msg.id === id ? { ...msg, status: newStatus } : msg
        ));
        setSelectedMessage({ ...selectedMessage, status: newStatus });
        setStatus(newStatus);
      } else {
        console.error("❌ Failed to update ticket status:", result.error);
      }
    } catch (error) {
      console.error("❌ Error updating ticket status:", error);
    }
  };

  const handleSendReply = async () => {
    if (!replyText.trim()) return;

    const newReply = {
      sender: "Support Team",
      message: replyText,
      timestamp: new Date().toISOString(),
    };

    const updatedConversation = [...(selectedMessage.conversation || []), newReply];

    try {
      const response = await fetch("/api/update-ticket", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedMessage.id,
          conversation: updatedConversation,
        }),
      });

      const result = await response.json();
      if (result.success) {
        setMessages(messages.map((msg) =>
          msg.id === selectedMessage.id ? { ...msg, conversation: updatedConversation } : msg
        ));
        setSelectedMessage({ ...selectedMessage, conversation: updatedConversation });
      } else {
        console.error("❌ Failed to update ticket:", result.error);
      }
    } catch (error) {
      console.error("❌ Error updating ticket:", error);
    }

    setReplyText("");
  };

  const deleteTicket = async (id) => {
    try {
      const response = await fetch("/api/delete-ticket", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      const result = await response.json();
      if (result.success) {
        setMessages(messages.filter((msg) => msg.id !== id));
        setSelectedMessage(null);
      } else {
        console.error("❌ Failed to delete ticket:", result.error);
      }
    } catch (error) {
      console.error("❌ Error deleting ticket:", error);
    }
  };

  const getStatusTag = (status) => {
    let color = "bg-gray-400";
    if (status === "open") color = "bg-green-500";
    if (status === "attending") color = "bg-yellow-500";
    if (status === "closed") color = "bg-red-500";

    return <span className={`px-2 py-1 text-white text-xs font-bold rounded ${color}`}>{status.toUpperCase()}</span>;
  };

  return (
    <div className="max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Inbox</h1>
      <div className="mb-4">
        <Input type="text" placeholder="Search messages..." className="w-full" />
      </div>
      <div className="space-y-2 mb-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className="flex items-center justify-between p-3 rounded cursor-pointer bg-white hover:bg-gray-100"
          >
            <div className="flex-grow" onClick={() => openTicket(message)}>
              <div className="flex justify-between">
                <span className="font-semibold text-black">{message.from_email || "Unknown Sender"}</span>
                <span className="text-sm text-gray-500">
                  {message.created_at ? format(new Date(message.created_at), "MMM d, yyyy h:mm a") : "Unknown Time"}
                </span>
              </div>
              <div className="text-sm text-gray-600 truncate">{message.subject}</div>
            </div>
            <div className="ml-4 flex items-center space-x-3">
              {getStatusTag(message.status)}
              <Button variant="ghost" onClick={() => deleteTicket(message.id)}>
                <Trash2 className="h-5 w-5 text-red-500" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {selectedMessage && (
        <div id="ticketModal" className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4" onClick={closeTicket}>
          <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[80vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">{selectedMessage.subject}</h3>
              <Button variant="ghost" onClick={() => setSelectedMessage(null)}>
                <X className="h-6 w-6 text-gray-600" />
              </Button>
            </div>
            <div className="mb-4">
              <p><strong>From:</strong> {selectedMessage.from_email || "Unknown Sender"}</p>
              <p><strong>Date:</strong> {selectedMessage.created_at ? format(new Date(selectedMessage.created_at), "MMM d, yyyy h:mm a") : "Unknown Time"}</p>
            </div>

            <div className="mb-4">
              <label className="block font-bold mb-1">Status:</label>
              <select
                value={status}
                onChange={(e) => updateTicketStatus(selectedMessage.id, e.target.value)}
                className="w-full p-2 border rounded-md"
              >
                <option value="open">🟢 Open</option>
                <option value="attending">🟡 Attending</option>
                <option value="closed">🔴 Closed</option>
              </select>
            </div>

            {/* ✅ Conversation History */}
            {selectedMessage.conversation?.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-bold mb-2">Conversation History:</h4>
                {selectedMessage.conversation.map((reply, index) => (
                  <div key={index} className="mb-2">
                    <p><strong>{reply.sender}:</strong> {reply.message}</p>
                    <p className="text-sm text-gray-500">{reply.timestamp ? format(new Date(reply.timestamp), "MMM d, yyyy h:mm a") : "Unknown Time"}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ✅ Chatbox & Reply Button */}
            <Textarea placeholder="Type your reply here..." value={replyText} onChange={(e) => setReplyText(e.target.value)} rows={4} />
            <div className="flex justify-end space-x-2 mt-2">
              <Button onClick={handleSendReply}><Send className="mr-2 h-4 w-4" /> Send Reply</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
