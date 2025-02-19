"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

const mockMessages = [
  {
    id: 1,
    user: "John Doe",
    message: "I need help with my order",
    timestamp: "2023-05-10T14:30:00Z",
    status: "pending",
  },
  {
    id: 2,
    user: "Jane Smith",
    message: "How do I reset my password?",
    timestamp: "2023-05-10T15:45:00Z",
    status: "pending",
  },
  {
    id: 3,
    user: "Bob Johnson",
    message: "When will my item be shipped?",
    timestamp: "2023-05-10T16:20:00Z",
    status: "pending",
  },
]

export default function Inbox() {
  const [selectedMessage, setSelectedMessage] = useState(null)

  return (
    <div className="flex h-full">
      <div className="w-1/3 pr-6">
        <h2 className="text-2xl font-bold mb-4">Inbox</h2>
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <Card key={message.id} className="cursor-pointer" onClick={() => setSelectedMessage(message)}>
              <CardHeader>
                <CardTitle>{message.user}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500">{new Date(message.timestamp).toLocaleString()}</p>
                <p className="truncate">{message.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      <div className="w-2/3 pl-6 border-l">
        {selectedMessage ? (
          <div>
            <h2 className="text-2xl font-bold mb-4">Message Details</h2>
            <Card>
              <CardHeader>
                <CardTitle>{selectedMessage.user}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-2">{new Date(selectedMessage.timestamp).toLocaleString()}</p>
                <p className="mb-4">{selectedMessage.message}</p>
                <div className="space-y-4">
                  <Input placeholder="Type your response..." />
                  <Button>Send Response</Button>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <p className="text-gray-500">Select a message to view details</p>
        )}
      </div>
    </div>
  )
}

