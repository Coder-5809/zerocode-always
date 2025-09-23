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

const SAMURAI_API_BASE = "https://samuraiapi.in/v1";
const SAMURAI_API_KEY = "sk-X6x1NBcQx3UxqWZDHEP271SPdrI0gevtNTEIvGDWRAaubwz2"; // replace with your key

// --- System Prompts ---
const planningSystemPrompt = `
You are GPT-5, a master *planner*.
Your job: break user requests into structured, actionable plans.
- Think step by step.
- Focus on clarity and feasibility.
- Do NOT write code — only explain what should be built and how.
- Your output should be a clean, numbered plan developers can follow.
`;

const codingSystemPrompt = `
You are Claude Sonnet 4, an expert software engineer.
Your role is to take the plan from GPT-5 and write complete, production-ready code.

Guidelines:
- Always use React with TypeScript.
- Prefer shadcn/ui components and TailwindCSS for styling.
- Ensure accessibility, responsiveness, and maintainability.
- Provide full code blocks, not snippets, so the code can run directly.
- Add helpful comments for non-trivial logic.

Special File Commands:
You can use these commands to interact with the codebase:
- <zerocode-read-filename.tsx> → read a file
- <zerocode-write-filename.tsx> → create/write a new file
- <zerocode-edit-filename.tsx> → edit an existing file

When you need to modify files, use these tags instead of describing changes in plain text.
`;

export default function AIPanel({ onCodeGenerated }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "What do you want to design?",
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
      // Step 1 → Planning with GPT-5
      const plan = await callSamuraiAI("Free/Samurai/gpt-5", originalInput);

      const planningMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: "ai",
        content: plan,
        aiType: "planning",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, planningMessage]);

      // Step 2 → Send plan to Claude Sonnet 4 for coding
      const code = await callSamuraiAI("Free/Samurai/claude-sonnet-4", plan);

      if (onCodeGenerated) onCodeGenerated(code);

      const codingMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: "ai",
        content: code,
        aiType: "coding",
        timestamp: new Date()
      };
      setMessages(prev => [...prev, codingMessage]);

    } catch (error) {
      console.error("AI request failed:", error);
      setMessages(prev => [
        ...prev,
        {
          id: (Date.now() + 1).toString(),
          type: "ai",
          content: "❌ Error while generating plan/code.",
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
        processedResponse = processedResponse.replace(match, `📖 Reading ${filename}`);
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

  const callSamuraiAI = async (model: string, prompt: string): Promise<string> => {
    try {
      let systemPrompt = "";
      if (model === "gpt-5") systemPrompt = planningSystemPrompt;
      else if (model.includes("claude")) systemPrompt = codingSystemPrompt;

      const res = await fetch(`${SAMURAI_API_BASE}/chat/completions`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${SAMURAI_API_KEY}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 3000
        })
      });

      const data = await res.json();
      let response = data?.choices?.[0]?.message?.content || JSON.stringify(data);

      // Let Claude’s file commands be processed
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

  const getAIBadgeText = (aiType?: string) => {
    if (aiType === "planning") return "Planning";
    if (aiType === "coding") return "Coding";
    return "AI";
  };

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
