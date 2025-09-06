import { useState } from "react";
import { Button } from "@/components/ui/button";
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
  Terminal
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

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

const sampleCode = `import React from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  return (
    <div className="min-h-screen bg-background">
      <Header onMenuClick={() => setSidebarOpen(!sidebarOpen)} />
      
      <div className="flex">
        <Sidebar isOpen={sidebarOpen} />
        
        <main className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl font-bold text-glow mb-4">
              Welcome to ZeroCode
            </h1>
            
            <p className="text-lg text-muted-foreground mb-8">
              Build beautiful applications without writing code.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <FeatureCard key={index} {...feature} />
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;`;

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

  return (
    <div className="h-screen bg-background flex flex-col animate-fade-in">
      {/* Editor Header */}
      <div className="h-14 border-b border-border bg-surface-elevated flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
              <File className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Code Editor</span>
          </div>
          
          <div className="flex items-center gap-1">
            <Badge variant="secondary" className="gap-1">
              <div className="h-2 w-2 rounded-full bg-green-400"></div>
              Connected
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button variant="glow" size="sm">
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
          <Button variant="ghost" size="sm">
            <Settings className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* File Explorer */}
        <div className="w-64 border-r border-border bg-sidebar flex flex-col">
          <div className="p-3 border-b border-sidebar-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-sidebar-foreground">Explorer</span>
              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                <Plus className="h-3 w-3" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-2 top-2 h-3 w-3 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search files..."
                className="w-full pl-7 pr-2 py-1 text-xs bg-input border border-border rounded text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
          
          <div className="flex-1 overflow-auto p-2">
            {fileTree.map((item, index) => (
              <FileTreeItem key={index} item={item} />
            ))}
          </div>
        </div>

        {/* Main Editor */}
        <div className="flex-1 flex flex-col">
          {/* Tabs */}
          <div className="h-10 border-b border-border bg-surface flex items-center px-2">
            <div className="flex items-center gap-1">
              <div className="flex items-center gap-2 px-3 py-1 bg-surface-elevated rounded-t border-b-2 border-glow text-sm text-foreground">
                <File className="h-3 w-3" />
                {activeFile}
              </div>
            </div>
          </div>

          {/* Code Area */}
          <div className="flex-1 flex">
            <div className="flex-1 relative">
              <pre className="h-full overflow-auto p-4 bg-surface text-sm text-foreground font-mono leading-relaxed">
                <code>{sampleCode}</code>
              </pre>
            </div>

            {/* Preview Panel */}
            <div className="w-96 border-l border-border bg-surface-elevated">
              <div className="h-10 border-b border-border flex items-center px-4">
                <span className="text-sm font-medium text-foreground">Preview</span>
              </div>
              <div className="p-4">
                <Card className="p-6 bg-background border-border">
                  <div className="text-center">
                    <h1 className="text-2xl font-bold text-glow mb-4">Welcome to ZeroCode</h1>
                    <p className="text-muted-foreground mb-6">
                      Build beautiful applications without writing code.
                    </p>
                    <div className="grid gap-4">
                      <div className="p-4 bg-surface-elevated rounded-lg border border-border">
                        <h3 className="font-semibold text-foreground mb-2">Visual Builder</h3>
                        <p className="text-sm text-muted-foreground">Drag and drop components</p>
                      </div>
                      <div className="p-4 bg-surface-elevated rounded-lg border border-border">
                        <h3 className="font-semibold text-foreground mb-2">Live Preview</h3>
                        <p className="text-sm text-muted-foreground">See changes instantly</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Terminal */}
      <div className="h-32 border-t border-border bg-surface-elevated">
        <div className="h-8 border-b border-border flex items-center px-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-glow" />
            <span className="text-sm font-medium text-foreground">Terminal</span>
          </div>
        </div>
        <div className="p-4 font-mono text-sm text-foreground overflow-auto">
          <div className="text-glow">$ npm run dev</div>
          <div className="text-green-400">✓ Ready in 847ms</div>
          <div className="text-gray-400">→ Local: http://localhost:3000</div>
          <div className="text-gray-400">→ Network: http://192.168.1.1:3000</div>
          <div className="flex items-center">
            <span className="text-glow mr-2">$</span>
            <span className="bg-transparent border-none outline-none text-foreground">_</span>
          </div>
        </div>
      </div>
    </div>
  );
}