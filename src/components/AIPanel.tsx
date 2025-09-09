import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  Code,
  Image,
  Lightbulb,
  Bot,
  User
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  aiType?: "planning" | "coding" | "image";
  timestamp: Date;
}

interface AIPanelProps {
  onCodeGenerated?: (code: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

const GITHUB_API_BASE = "https://models.github.ai/inference";
const GITHUB_TOKEN = "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";

export default function AIPanel({ onCodeGenerated, onImageGenerated }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "I'll create a modern AI startup landing page with a sleek, futuristic design.",
      aiType: "planning",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const originalInput = input;
    setInput("");
    setIsLoading(true);

    try {
      const isWebsitePrompt =
        originalInput.toLowerCase().includes("website") ||
        originalInput.toLowerCase().includes("landing page") ||
        originalInput.toLowerCase().includes("app") ||
        originalInput.toLowerCase().includes("build") ||
        originalInput.toLowerCase().includes("create") ||
        originalInput.toLowerCase().includes("design");

      let aiType: "planning" | "coding" | "image" = "planning";
      if (originalInput.toLowerCase().includes("image") || originalInput.toLowerCase().includes("picture")) {
        aiType = "image";
      } else if (originalInput.toLowerCase().includes("code") || originalInput.toLowerCase().includes("implement")) {
        aiType = "coding";
      }

      let response = "";

      if (aiType === "image") {
        const imageUrl = await callGitHubImage(originalInput);
        response = `Generated image: ${imageUrl}`;
        onImageGenerated?.(imageUrl);
      } else if (isWebsitePrompt) {
        const planningPrompt = `Create a detailed plan for: ${originalInput}`;

        const thinkingMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "Thinking through the project structure and requirements...",
          aiType: "planning",
          timestamp: new Date()
        };

        setMessages(prev => [...prev, thinkingMessage]);

        const planningResponse = await callGitHubAI("openai/gpt-5", planningPrompt);

        const codingPrompt = `Based on this plan, generate the complete React/TypeScript code:\nPLAN:\n${planningResponse}`;

        const codingResponse = await callGitHubAI("cohere/cohere-command-a", codingPrompt);

        response = String(codingResponse);
        aiType = "coding";
        onCodeGenerated?.(response);
      } else if (aiType === "planning") {
        const rawResponse = await callGitHubAI("openai/gpt-5", originalInput);
        response = String(rawResponse);
      } else if (aiType === "coding") {
        const rawResponse = await callGitHubAI("cohere/cohere-command-a", originalInput);
        response = String(rawResponse);
        onCodeGenerated?.(response);
      }

      if (typeof response === "object") response = JSON.stringify(response);

      const aiMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: "ai",
        content: response,
        aiType,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error("AI request failed:", error);
      setMessages(prev => [...prev, { id: (Date.now() + 1).toString(), type: "ai", content: "Sorry, I encountered an error.", timestamp: new Date() }]);
    } finally {
      setIsLoading(false);
    }
  };

  const callGitHubAI = async (model: string, prompt: string): Promise<string> => {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model, messages: [{ role: "system", content: "You are an AI assistant." }, { role: "user", content: prompt }] })
      });

      const data = await res.json();
      return data?.choices?.[0]?.message?.content || JSON.stringify(data);
    } catch (error) {
      return `Error: ${error.message || "Failed to get AI response"}`;
    }
  };

  const callGitHubImage = async (prompt: string): Promise<string> => {
    try {
      const res = await fetch(`${GITHUB_API_BASE}/images/generations`, {
        method: "POST",
        headers: {
          Accept: "application/vnd.github+json",
          Authorization: `Bearer ${GITHUB_TOKEN}`,
          "X-GitHub-Api-Version": "2022-11-28",
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ model: "openai/dall-e-3", prompt, size: "1024x1024" })
      });

      const data = await res.json();
      return data?.data?.[0]?.url || "/placeholder.svg";
    } catch (error) {
      return "/placeholder.svg";
    }
  };

  const getAIIcon = (aiType?: string) => aiType === "planning" ? <Lightbulb className="h-3 w-3" /> : aiType === "coding" ? <Code className="h-3 w-3" /> : aiType === "image" ? <Image className="h-3 w-3" /> : <Bot className="h-3 w-3" />;

  const getAIBadgeText = (aiType?: string) => aiType === "planning" ? "GPT-4.1" : aiType === "coding" ? "Claude Sonnet" : aiType === "image" ? "DALL-E 3" : "AI";

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      <div className="p-4 border-b border-sidebar-border flex items-center gap-2 mb-2">
        <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="font-semibold text-sidebar-foreground">AI Assistant</span>
      </div>

      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map(message => (
            <div key={message.id} className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}>
              <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${message.type === "user" ? "bg-primary text-primary-foreground" : "bg-gradient-primary text-primary-foreground"}`}>
                {message.type === "user" ? <User className="h-3 w-3" /> : getAIIcon(message.aiType)}
              </div>
              <div className={`flex-1 space-y-1 ${message.type === "user" ? "text-right" : ""}`}>
                <div className="flex items-center gap-2">
                  {message.type === "ai" && message.aiType && (<Badge variant="secondary" className="text-xs h-4 px-1">{getAIBadgeText(message.aiType)}</Badge>)}
                  <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className={`rounded-lg p-3 text-sm max-w-[280px] ${message.type === "user" ? "bg-primary text-primary-foreground ml-auto" : "bg-surface border border-border text-foreground"}`}>
                  {message.content}
                </div>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="flex-1"><div className="rounded-lg p-3 bg-surface border border-border"><div className="flex items-center gap-1"><div className="h-1 w-1 rounded-full bg-primary animate-bounce"></div><div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.1s" }}></div><div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: "0.2s" }}></div></div></div></div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex gap-2">
          <Input value={input} onChange={e => setInput(e.target.value)} placeholder="Ask AI to build something..." className="flex-1 bg-surface border-border" onKeyPress={e => e.key === "Enter" && sendMessage()} disabled={isLoading} />
          <Button onClick={sendMessage} disabled={!input.trim() || isLoading} size="sm" className="h-10 w-10 p-0">
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
