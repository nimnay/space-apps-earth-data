"use client";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";

interface Message {
  type: "user" | "ai";
  content: string;
  mode: "wildfire" | "pollution";
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [mode, setMode] = useState<"wildfire" | "pollution">("pollution");

  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message
    const userMessage: Message = {
      type: "user",
      content: input,
      mode: mode,
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log('Sending request:', { message: input, mode });
      
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: input,
          mode: mode,
        }),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to get AI response');
      }
      
      // Add AI response
      const aiMessage: Message = {
        type: "ai",
        content: data.response || "Sorry, I couldn't process that request.",
        mode: mode,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      // Add error message
      const errorMessage: Message = {
        type: "ai",
        content: error instanceof Error ? error.message : "Sorry, there was an error processing your request.",
        mode: mode,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="w-full">
        <div className="p-4">
          <div className="flex gap-2 mb-4">
            <Button
              variant={mode === "pollution" ? "default" : "outline"}
              onClick={() => setMode("pollution")}
            >
              Pollution Mode
            </Button>
            <Button
              variant={mode === "wildfire" ? "default" : "outline"}
              onClick={() => setMode("wildfire")}
            >
              Wildfire Mode
            </Button>
          </div>
          
          <ScrollArea className="h-[500px] mb-4 p-4 rounded-lg border">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-3 rounded-lg ${
                      message.type === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    <pre className="whitespace-pre-wrap font-sans">
                      {message.content}
                    </pre>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-3 rounded-lg bg-muted animate-pulse">
                    Thinking...
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
              placeholder={
                mode === "pollution"
                  ? "Ask about air quality for your activity..."
                  : "Ask about wildfire conditions..."
              }
              className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <Button onClick={sendMessage} disabled={isLoading}>
              Send
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}