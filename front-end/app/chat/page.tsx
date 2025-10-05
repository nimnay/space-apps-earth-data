"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import Markdown from "react-markdown";

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
      console.log("Sending request:", { message: input, mode });

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
        throw new Error(data.error || "Failed to get AI response");
      }

      // Add AI response
      const aiMessage: Message = {
        type: "ai",
        content: data.advice || "Sorry, I couldn't process that request.",
        mode: mode,
      };
      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error("Failed to send message:", error);
      const errorMessage: Message = {
        type: "ai",
        content:
          error instanceof Error
            ? error.message
            : "Sorry, there was an error processing your request.",
        mode: mode,
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto max-w-4xl p-4">
      <Card className="w-full bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900 shadow-lg">
        <div className="p-6">
          <div className="flex gap-3 mb-6 justify-center">
            <Button
              variant={mode === "pollution" ? "default" : "outline"}
              onClick={() => setMode("pollution")}
              className={`${
                mode === "pollution" ? "bg-blue-600 hover:bg-blue-700" : ""
              } text-sm font-semibold px-6 py-2 rounded-full transition-all`}
            >
              🌫️ Air Quality Mode
            </Button>
            <Button
              variant={mode === "wildfire" ? "default" : "outline"}
              onClick={() => setMode("wildfire")}
              className={`${
                mode === "wildfire" ? "bg-red-600 hover:bg-red-700" : ""
              } text-sm font-semibold px-6 py-2 rounded-full transition-all`}
            >
              🔥 Wildfire Mode
            </Button>
          </div>

          <ScrollArea className="h-[600px] mb-6 p-6 rounded-xl border bg-white/50 dark:bg-slate-950/50 backdrop-blur-sm shadow-inner">
            <div className="flex flex-col gap-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`flex ${
                    message.type === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.type === "user"
                        ? "bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg ml-4"
                        : "bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 shadow-md mr-4"
                    } transform transition-all duration-200 hover:scale-[1.02]`}
                  >
                    <Markdown>{message.content}</Markdown>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="max-w-[80%] p-4 rounded-2xl bg-gradient-to-r from-gray-100 to-gray-50 dark:from-slate-800 dark:to-slate-700 shadow-md mr-4">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce"></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="flex gap-3">
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
              className="flex-1 p-4 rounded-xl border bg-white dark:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-inner text-[15px] transition-all placeholder:text-gray-400"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading}
              className="px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {isLoading ? "Sending..." : "Send"}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
