"use client"

import { useState } from "react"
import { Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

interface Message {
  content: string
  isUser: boolean
}

export default function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([
    { content: "Hello! How can I assist you today?", isUser: false },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const sendMessageToWebhook = async (message: string) => {
    setIsLoading(true)
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
      })

      if (!response.ok) {
        throw new Error("Failed to send message to webhook")
      }

      const data = await response.json()
      return data.response
    } catch (error) {
      console.error("Error sending message to webhook:", error)
      return "Sorry, I'm having trouble connecting to the server right now."
    } finally {
      setIsLoading(false)
    }
  }

  const handleSendMessage = async () => {
    if (input.trim() && !isLoading) {
      const userMessage = input.trim()
      setMessages((prevMessages) => [...prevMessages, { content: userMessage, isUser: true }])
      setInput("")

      const botResponse = await sendMessageToWebhook(userMessage)
      setMessages((prevMessages) => [...prevMessages, { content: botResponse, isUser: false }])
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Chatbot</CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px] w-full pr-4">
          <div className="space-y-4">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.isUser ? "justify-end" : "justify-start"}`}>
                {!message.isUser && (
                  <Avatar className="mr-2">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Bot" />
                    <AvatarFallback>Bot</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`rounded-lg px-4 py-2 max-w-[70%] ${
                    message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"
                  }`}
                >
                  {message.content}
                </div>
                {message.isUser && (
                  <Avatar className="ml-2">
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                    <AvatarFallback>You</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            handleSendMessage()
          }}
          className="flex w-full items-center space-x-2"
        >
          <Input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-grow"
            disabled={isLoading}
          />
          <Button type="submit" size="icon" disabled={isLoading}>
            <Send className="h-4 w-4" />
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}

