import { useState, useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Terminal, 
  X, 
  ChevronRight,
  AlertCircle,
  Info,
  AlertTriangle,
  Trash2
} from "lucide-react";

interface LogEntry {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
  source?: string;
}

export default function ConsolePanel() {
  const [logs, setLogs] = useState<LogEntry[]>([
    {
      id: '1',
      type: 'info',
      message: 'React app started successfully',
      timestamp: new Date(Date.now() - 5000),
      source: 'main.tsx'
    },
    {
      id: '2', 
      type: 'log',
      message: 'Component rendered: Header',
      timestamp: new Date(Date.now() - 3000),
      source: 'Header.tsx'
    },
    {
      id: '3',
      type: 'warn',
      message: 'Warning: Component is using deprecated prop',
      timestamp: new Date(Date.now() - 1000),
      source: 'Button.tsx'
    }
  ]);
  const [command, setCommand] = useState("");
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [logs]);

  const addLog = (type: LogEntry['type'], message: string, source?: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      type,
      message,
      timestamp: new Date(),
      source
    };
    setLogs(prev => [...prev, newLog]);
  };

  const executeCommand = () => {
    if (!command.trim()) return;

    // Add command to history
    setCommandHistory(prev => [...prev, command]);
    setHistoryIndex(-1);
    
    // Add command to logs
    addLog('log', `> ${command}`, 'console');

    // Simple command execution simulation
    switch (command.toLowerCase().trim()) {
      case 'clear':
        setLogs([]);
        break;
      case 'help':
        addLog('info', 'Available commands: clear, help, build, test', 'console');
        break;
      case 'build':
        addLog('info', 'Building application...', 'build');
        setTimeout(() => addLog('info', 'Build completed successfully!', 'build'), 1000);
        break;
      case 'test':
        addLog('info', 'Running tests...', 'test');
        setTimeout(() => addLog('info', 'All tests passed!', 'test'), 1500);
        break;
      default:
        addLog('error', `Command not found: ${command}`, 'console');
    }

    setCommand("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      executeCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1);
        setHistoryIndex(newIndex);
        setCommand(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex >= 0) {
        const newIndex = historyIndex + 1;
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1);
          setCommand("");
        } else {
          setHistoryIndex(newIndex);
          setCommand(commandHistory[newIndex]);
        }
      }
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  const getLogIcon = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-400" />;
      case 'warn':
        return <AlertTriangle className="h-4 w-4 text-yellow-400" />;
      case 'info':
        return <Info className="h-4 w-4 text-blue-400" />;
      default:
        return <ChevronRight className="h-4 w-4 text-gray-400" />;
    }
  };

  const getLogColor = (type: LogEntry['type']) => {
    switch (type) {
      case 'error':
        return 'text-red-400';
      case 'warn':
        return 'text-yellow-400';
      case 'info':
        return 'text-blue-400';
      default:
        return 'text-foreground';
    }
  };

  return (
    <div className="h-full bg-background border-t border-border flex flex-col">
      {/* Console Header */}
      <div className="h-10 px-4 border-b border-border bg-surface flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="h-4 w-4" />
          <span className="text-sm font-medium">Console</span>
          <span className="text-xs text-muted-foreground">({logs.length} logs)</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-6 w-6 p-0"
          onClick={clearLogs}
        >
          <Trash2 className="h-3 w-3" />
        </Button>
      </div>

      {/* Console Output */}
      <ScrollArea className="flex-1 p-2" ref={scrollAreaRef}>
        <div className="space-y-1 font-mono text-sm">
          {logs.map((log) => (
            <div key={log.id} className="flex items-start gap-2 py-1">
              {getLogIcon(log.type)}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                  <span>{log.timestamp.toLocaleTimeString()}</span>
                  {log.source && (
                    <>
                      <span>•</span>
                      <span>{log.source}</span>
                    </>
                  )}
                </div>
                <div className={getLogColor(log.type)}>
                  {log.message}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Command Input */}
      <div className="p-2 border-t border-border bg-surface">
        <div className="flex items-center gap-2">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
          <Input
            value={command}
            onChange={(e) => setCommand(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-background border-border font-mono text-sm"
          />
        </div>
      </div>
    </div>
  );
}