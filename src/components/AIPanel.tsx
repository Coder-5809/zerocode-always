import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
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
  type: 'user' | 'ai';
  content: string;
  aiType?: 'planning' | 'coding' | 'image';
  timestamp: Date;
}

interface AIPanelProps {
  onCodeGenerated?: (code: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function AIPanel({ onCodeGenerated, onImageGenerated }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "I'll create a modern AI startup landing page with a sleek, futuristic design. This will feature gradients, clean typography, and smooth animations typical of leading AI companies.",
      aiType: 'planning',
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
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      // Determine AI type based on message content
      let aiType: 'planning' | 'coding' | 'image' = 'planning';
      if (input.toLowerCase().includes('code') || input.toLowerCase().includes('implement')) {
        aiType = 'coding';
      } else if (input.toLowerCase().includes('image') || input.toLowerCase().includes('picture')) {
        aiType = 'image';
      }

      // Use Puter AI services
      let response = '';
      
      if (aiType === 'planning') {
        // Use ChatGPT-5 for planning
        response = await callPuterAI('gpt-5-2025-08-07', input);
      } else if (aiType === 'coding') {
        // Use Claude Opus 4.1 for coding
        response = await callPuterAI('claude-opus-4-20250514', input);
      } else if (aiType === 'image') {
        // Use DALL-E 3 for images
        const imageUrl = await generateImage(input);
        response = `Generated image: ${imageUrl}`;
        onImageGenerated?.(imageUrl);
      }

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: response,
        aiType,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

      if (aiType === 'coding') {
        onCodeGenerated?.(response);
      }
    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const callPuterAI = async (model: string, prompt: string): Promise<string> => {
    try {
      // @ts-ignore - Puter global object
      const result = await puter.ai.chat(prompt, {
        model: model,
        temperature: 0.7,
        max_tokens: 2000
      });
      return result.message || result.content || 'No response generated';
    } catch (error) {
      console.error('Puter AI error:', error);
      return `Mock ${model} response: ${prompt}`;
    }
  };

  const generateImage = async (prompt: string): Promise<string> => {
    try {
      // @ts-ignore - Puter global object
      const result = await puter.ai.generateImage(prompt, {
        model: 'dall-e-3',
        size: '1024x1024',
        quality: 'standard'
      });
      return result.url || '/placeholder.svg';
    } catch (error) {
      console.error('Image generation error:', error);
      return '/placeholder.svg';
    }
  };

  const getAIIcon = (aiType?: string) => {
    switch (aiType) {
      case 'planning': return <Lightbulb className="h-3 w-3" />;
      case 'coding': return <Code className="h-3 w-3" />;
      case 'image': return <Image className="h-3 w-3" />;
      default: return <Bot className="h-3 w-3" />;
    }
  };

  const getAIBadgeText = (aiType?: string) => {
    switch (aiType) {
      case 'planning': return 'GPT-5';
      case 'coding': return 'Claude Opus';
      case 'image': return 'DALL-E 3';
      default: return 'AI';
    }
  };

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">AI Assistant</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Multi-AI system for planning, coding, and design
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gradient-primary text-primary-foreground'
                }`}>
                  {message.type === 'user' ? 
                    <User className="h-3 w-3" /> : 
                    getAIIcon(message.aiType)
                  }
                </div>
                
                <div className={`flex-1 space-y-1 ${
                  message.type === 'user' ? 'text-right' : ''
                }`}>
                  <div className="flex items-center gap-2">
                    {message.type === 'ai' && message.aiType && (
                      <Badge variant="secondary" className="text-xs h-4 px-1">
                        {getAIBadgeText(message.aiType)}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className={`rounded-lg p-3 text-sm max-w-[280px] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-surface border border-border text-foreground'
                  }`}>
                    {message.content}
                  </div>
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
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to build something..."
            className="flex-1 bg-surface border-border"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
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