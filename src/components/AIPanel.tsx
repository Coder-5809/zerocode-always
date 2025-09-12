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
import Bytez from "bytez.js";

const sdk = new Bytez("34a591d47d60776c873fa6802db6c9df");
const gptModel = sdk.model("openai/gpt-4.5-preview");
const claudeModel = sdk.model("anthropic/claude-3-opus");

interface Message {
  id: string;
  type: "user" | "ai";
  content: string;
  aiType?: "planning" | "coding";
  timestamp: Date;
}

interface AIPanelProps {
  onCodeGenerated?: (code: string) => void;
}

export default function AIPanel({ onCodeGenerated }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      type: "ai",
      content: "What do you want to design.",
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

      let response = "";

      if (aiType === "planning") {
        // Step 1: Generate a project plan with GPT
        const { output: planningResponse } = await gptModel.run([
          { role: "system", content: `You are a strategic project planner for web applications.\n\nYour role:\n- Break down vague ideas into clear, actionable project plans.\n- Define technical requirements and architecture at a high level.\n- Suggest appropriate technologies, libraries, and frameworks.\n- Provide a phased roadmap with milestones.\n- Ensure accessibility, scalability, and performance are considered.\n- Communicate in a clear, structured, and concise way.\n\nDo not generate code. Focus only on detailed planning and strategy.` },
          { role: "user", content: originalInput }
        ]);

        // Step 2: Summarize the plan for user display
        const planSummary = typeof planningResponse === "string" && planningResponse.length > 200
          ? planningResponse.slice(0, 200) + "..."
          : planningResponse;

        const summaryMessage: Message = {
          id: (Date.now() + Math.random()).toString(),
          type: "ai",
          content: `Project Plan Summary: ${planSummary}`,
          aiType: "planning",
          timestamp: new Date()
        };

        setMessages(prev => [...prev, summaryMessage]);

        // Step 3: Pass full plan to Claude for coding
        const { output: codingResponse } = await claudeModel.run([
          { role: "system", content: `You are an expert React TypeScript developer with deep knowledge of shadcn/ui, Tailwind CSS, and modern web development best practices.\n\nKey Guidelines:\n- Always use React with TypeScript\n- Use shadcn/ui components when possible\n- Use Tailwind CSS for styling with semantic design tokens\n- Write clean, maintainable, and well-documented code\n- Follow React best practices and hooks patterns\n- Use proper TypeScript types and interfaces\n- Create responsive designs\n- Focus on accessibility and performance\n\nWhen generating code:\n- Provide complete, working examples\n- Include proper imports and dependencies\n- Use semantic HTML elements\n- Follow consistent naming conventions\n- Add appropriate error handling\n- Include helpful comments for complex logic\n\nAlways aim to create production-ready code that follows industry standards.` },
          { role: "user", content: `Based on this project plan, generate the complete code:\n\n${planningResponse}` }
        ]);

        response = String(codingResponse);
        aiType = "coding";
        onCodeGenerated?.(response);
      } else if (aiType === "coding") {
        const { output } = await claudeModel.run([
          { role: "system", content: `You are an expert React TypeScript developer with deep knowledge of shadcn/ui, Tailwind CSS, and modern web development best practices.\n\nKey Guidelines:\n- Always use React with TypeScript\n- Use shadcn/ui components when possible\n- Use Tailwind CSS for styling with semantic design tokens\n- Write clean, maintainable, and well-documented code\n- Follow React best practices and hooks patterns\n- Use proper TypeScript types and interfaces\n- Create responsive designs\n- Focus on accessibility and performance\n\nWhen generating code:\n- Provide complete, working examples\n- Include proper imports and dependencies\n- Use semantic HTML elements\n- Follow consistent naming conventions\n- Add appropriate error handling\n- Include helpful comments for complex logic\n\nAlways aim to create production-ready code that follows industry standards.` },
          { role: "user", content: originalInput }
        ]);
        response = String(output);
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

  const getAIIcon = (aiType?: string) =>
    aiType === "planning" ? (
      <Lightbulb className="h-3 w-3" />
    ) : aiType === "coding" ? (
      <Code className="h-3 w-3" />
    ) : (
      <Bot className="h-3 w-3" />
    );

  const getAIBadgeText = (aiType?: string) =>
    aiType === "planning" ? "GPT-4.5" : aiType === "coding" ? "Claude-3 Opus" : "AI";

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
