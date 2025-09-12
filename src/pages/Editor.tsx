import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Save, 
  Settings, 
  Folder,
  File,
  ChevronRight,
  ChevronDown,
  Plus,
  Search,
  Terminal,
  Share,
  ArrowLeft,
  Code,
  MessageCircle,
  Sparkles,
  Monitor,
  Bug
} from "lucide-react";
import { Link } from "react-router-dom";
import AIPanel from "@/components/AIPanel";
import CodeEditor from "@/components/CodeEditor";
import ConsolePanel from "@/components/ConsolePanel";

const fileTree = [
  {
    name: "src",
    type: "folder",
    expanded: true,
    children: [
      { name: "components", type: "folder", expanded: true, children: [
        { name: "Header.tsx", type: "file" },
        { name: "Sidebar.tsx", type: "file" },
        { name: "Button.tsx", type: "file" }
      ]},
      { name: "pages", type: "folder", expanded: false, children: [
        { name: "Home.tsx", type: "file" },
        { name: "About.tsx", type: "file" }
      ]},
      { name: "App.tsx", type: "file", active: true },
      { name: "index.css", type: "file" },
      { name: "main.tsx", type: "file" }
    ]
  },
  {
    name: "public",
    type: "folder",
    expanded: false,
    children: [
      { name: "favicon.ico", type: "file" },
      { name: "index.html", type: "file" }
    ]
  },
  { name: "package.json", type: "file" },
  { name: "vite.config.ts", type: "file" }
];

function FileTreeItem({ item, level = 0 }: { item: any; level?: number }) {
  const [expanded, setExpanded] = useState(item.expanded);

  return (
    <div>
      <div 
        className={`flex items-center gap-1 py-1 px-2 rounded hover:bg-sidebar-accent cursor-pointer ${
          item.active ? 'bg-sidebar-accent text-glow' : 'text-sidebar-foreground'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => item.type === 'folder' && setExpanded(!expanded)}
      >
        {item.type === 'folder' && (
          expanded ? 
            <ChevronDown className="h-3 w-3" /> : 
            <ChevronRight className="h-3 w-3" />
        )}
        {item.type === 'folder' ? (
          <Folder className="h-4 w-4 text-blue-400" />
        ) : (
          <File className="h-4 w-4 text-gray-400" />
        )}
        <span className="text-sm">{item.name}</span>
      </div>
      
      {item.type === 'folder' && expanded && item.children && (
        <div>
          {item.children.map((child: any, index: number) => (
            <FileTreeItem key={index} item={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Editor() {
  const [activeFile, setActiveFile] = useState("App.tsx");
  const [generatedCode, setGeneratedCode] = useState("");

  const handleCodeGenerated = (code: string) => {
    setGeneratedCode(code);
    // Here you would update the preview with the generated code
  };

  const handleImageGenerated = (imageUrl: string) => {
    // Handle generated images
    console.log('Generated image:', imageUrl);
  };

  return (
    <div className="h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="h-14 border-b border-border bg-surface-elevated flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="sm" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </Link>
          
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <Code className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">AI Landing Page</span>
          </div>
          
          <Badge variant="secondary" className="gap-1">
            <div className="h-2 w-2 rounded-full bg-green-400"></div>
            Building
          </Badge>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="outline" size="sm">
            <Share className="h-4 w-4 mr-1" />
            Share
          </Button>
          <Button variant="glow" size="sm">
            Publish
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* AI Panel - 25% */}
        <div className="w-1/4 min-w-[320px]">
          <AIPanel 
            onCodeGenerated={handleCodeGenerated}
          />
        </div>

        {/* Main Content Area - 75% */}
        <div className="flex-1 flex flex-col">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            {/* Tabs */}
            <div className="h-10 border-b border-border bg-surface">
              <TabsList className="h-full rounded-none bg-transparent border-0 p-0">
                <TabsTrigger 
                  value="preview" 
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-glow data-[state=active]:bg-sidebar data-[state=active]:text-glow gap-2"
                >
                  <Monitor className="h-4 w-4" />
                  Preview
                </TabsTrigger>
                <TabsTrigger 
                  value="code" 
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-glow data-[state=active]:bg-sidebar data-[state=active]:text-glow gap-2"
                >
                  <Code className="h-4 w-4" />
                  Code
                </TabsTrigger>
                <TabsTrigger 
                  value="console" 
                  className="h-full rounded-none border-b-2 border-transparent data-[state=active]:border-glow data-[state=active]:bg-sidebar data-[state=active]:text-glow gap-2"
                >
                  <Terminal className="h-4 w-4" />
                  Console
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Tab Content */}
            <div className="flex-1">
              <TabsContent value="preview" className="h-full m-0 rounded-none">
                {/* Preview Area */}
                <div className="h-full flex items-center justify-center bg-surface relative">
                  <div className="absolute inset-0 bg-gradient-glow opacity-30"></div>
                  
                  <div className="relative text-center max-w-md">
                    <div className="relative mb-8">
                      <div className="h-32 w-32 rounded-full bg-gradient-primary animate-glow-pulse mx-auto flex items-center justify-center mb-6">
                        <Sparkles className="h-16 w-16 text-primary-foreground" />
                      </div>
                      
                      <div className="absolute inset-0 rounded-full bg-gradient-glow opacity-60 blur-xl animate-glow-pulse"></div>
                    </div>
                    
                    <h2 className="text-2xl font-bold text-foreground mb-4">
                      Live Preview Ready
                    </h2>
                    <p className="text-muted-foreground mb-6">
                      Multi-AI system active: GPT-5 for planning, Claude Opus for coding, DALL-E 3 for images.
                      Chat with AI in the left panel to start building.
                    </p>

                    <div className="flex justify-center gap-2 mb-6">
                      <div className="h-2 w-2 rounded-full bg-glow animate-bounce"></div>
                      <div className="h-2 w-2 rounded-full bg-glow animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="h-2 w-2 rounded-full bg-glow animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>

                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-green-400"></div>
                        <span>AI Planning Ready</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-green-400"></div>
                        <span>Code Generation Ready</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-1 w-1 rounded-full bg-green-400"></div>
                        <span>Image Generation Ready</span>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="code" className="h-full m-0 rounded-none">
                <CodeEditor generatedCode={generatedCode} />
              </TabsContent>

              <TabsContent value="console" className="h-full m-0 rounded-none">
                <ConsolePanel />
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}