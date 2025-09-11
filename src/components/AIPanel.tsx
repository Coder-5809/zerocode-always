import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import {
  Send,
  Sparkles,
  Code,
  Lightbulb,
  Bot,
  User
} from "lucide-react";

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  aiType?: "planning" | "coding";
  timestamp: Date;
}

interface AIPanelProps {
  onCodeGenerated?: (code: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

const OPENROUTER_API_BASE = "https://openrouter.ai/api/v1";
const OPENROUTER_TOKEN = "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";

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
      let aiType: "planning" | "coding" = "planning";
      if (
        originalInput.toLowerCase().includes("code") ||
        originalInput.toLowerCase().includes("implement") ||
        originalInput.toLowerCase().includes("build")
      ) {
        aiType = "coding";
      }

      const response = await callOpenRouterAI("nvidia/nemotron-nano-9b-v2:free", originalInput);

      if (aiType === "coding") {
        onCodeGenerated?.(response);
      }

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
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "Sorry, I encountered an error.",
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const processFileCommands = async (response: string): Promise<string> => {
    let processedResponse = response;
    
    // Process read commands
    const readMatches = response.match(/<zerocode-read-([^>]+)>/g);
    if (readMatches) {
      for (const match of readMatches) {
        const filename = match.replace(/<zerocode-read-([^>]+)>/, '$1');
        try {
          // In a real implementation, you would call lov-view here
          // For now, we'll just show a reading message
          processedResponse = processedResponse.replace(match, `📖 Reading ${filename}`);
        } catch (error) {
          processedResponse = processedResponse.replace(match, `❌ Error reading ${filename}`);
        }
      }
    }
    
    // Process write commands  
    const writeMatches = response.match(/<zerocode-write-([^>]+)>/g);
    if (writeMatches) {
      for (const match of writeMatches) {
        const filename = match.replace(/<zerocode-write-([^>]+)>/, '$1');
        processedResponse = processedResponse.replace(match, `✏️ Writing ${filename}`);
      }
    }
    
    // Process edit commands
    const editMatches = response.match(/<zerocode-edit-([^>]+)>/g);
    if (editMatches) {
      for (const match of editMatches) {
        const filename = match.replace(/<zerocode-edit-([^>]+)>/, '$1');
        processedResponse = processedResponse.replace(match, `📝 Editing ${filename}`);
      }
    }
    
    return processedResponse;
  };

  const callOpenRouterAI = async (model: string, prompt: string): Promise<string> => {
    try {
      // Build conversation history from messages
      const conversationHistory = messages.map(msg => ({
        role: msg.type === "user" ? "user" : "assistant",
        content: msg.content
      }));

      const systemPrompt = `You are an expert React TypeScript developer with deep knowledge of shadcn/ui, Tailwind CSS, and modern web development best practices.

Key Guidelines:
- Always use React with TypeScript
- Use shadcn/ui components when possible
- Use Tailwind CSS for styling with semantic design tokens
- Write clean, maintainable, and well-documented code
- Follow React best practices and hooks patterns
- Use proper TypeScript types and interfaces
- Create responsive designs
- Focus on accessibility and performance

When generating code:
- Provide complete, working examples
- Include proper imports and dependencies
- Use semantic HTML elements
- Follow consistent naming conventions
- Add appropriate error handling
- Include helpful comments for complex logic

File Operations Commands:
You have access to these special commands for file operations:
- <zerocode-read-filename.tsx> - Use this to read any file in the project
- <zerocode-write-filename.tsx> - Use this to write/create new files
- <zerocode-edit-filename.tsx> - Use this to edit existing files

When you need to work with files, use these commands and I'll handle the actual file operations.

Always aim to create production-ready code that follows industry standards.`;

      const res = await fetch(`${OPENROUTER_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENROUTER_TOKEN}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            ...conversationHistory,
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 2000
        })
      });

      const data = await res.json();
      let response = data?.choices?.[0]?.message?.content || JSON.stringify(data);
      
      // Process file operation commands
      response = await processFileCommands(response);
      
      return response;
    } catch (error) {
      return `Error: ${error.message || "Failed to get AI response"}`;
    }
  };

  const getAIIcon = (aiType?: string) =>
    aiType === "planning" ? (
      <Lightbulb className="h-3 w-3" />
    ) : aiType === "coding" ? (
      <Code className="h-3 w-3" />
    ) : (
      <Bot className="h-3 w-3" />
    );

  const getAIBadgeText = (aiType?: string) => "Nemotron-9B";

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
            <div
              key={message.id}
              className={`flex items-start gap-3 ${message.type === "user" ? "flex-row-reverse" : ""}`}
            >
              <div
                className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  message.type === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-gradient-primary text-primary-foreground"
                }`}
              >
                {message.type === "user" ? <User className="h-3 w-3" /> : getAIIcon(message.aiType)}
              </div>
              <div
                className={`flex-1 space-y-1 ${message.type === "user" ? "text-right" : ""}`}
              >
                <div className="flex items-center gap-2">
                  {message.type === "ai" && message.aiType && (
                    <Badge variant="secondary" className="text-xs h-4 px-1">
                      {getAIBadgeText(message.aiType)}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">
                    {message.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <div
                  className={`rounded-lg p-3 text-sm max-w-[280px] ${
                    message.type === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-surface border border-border text-foreground"
                  }`}
                >
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
              <div className="flex-1">
                <div className="rounded-lg p-3 bg-surface border border-border">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce"></div>
                    <div
                      className="h-1 w-1 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="h-1 w-1 rounded-full bg-primary animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-4 border-t border-sidebar-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ask AI to build something..."
            className="flex-1 bg-surface border-border"
            onKeyPress={e => e.key === "Enter" && sendMessage()}
            disabled={isLoading}
          />
          <Button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
