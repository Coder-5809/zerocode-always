import { useState, useEffect } from "react";
import Editor from "@monaco-editor/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  File, 
  Folder, 
  ChevronRight, 
  ChevronDown, 
  Plus,
  Search,
  MoreHorizontal,
  X
} from "lucide-react";

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  path: string;
  content?: string;
  children?: FileNode[];
  expanded?: boolean;
}

const defaultFiles: FileNode[] = [
  {
    name: "src",
    type: "folder",
    path: "src",
    expanded: true,
    children: [
      {
        name: "components",
        type: "folder", 
        path: "src/components",
        expanded: true,
        children: [
          { 
            name: "Header.tsx", 
            type: "file", 
            path: "src/components/Header.tsx",
            content: `import { FC } from 'react';

interface HeaderProps {
  title: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
  return (
    <header className="bg-primary text-primary-foreground p-4">
      <h1 className="text-2xl font-bold">{title}</h1>
    </header>
  );
};`
          },
          { 
            name: "Button.tsx", 
            type: "file", 
            path: "src/components/Button.tsx",
            content: `import { FC, ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button: FC<ButtonProps> = ({ 
  children, 
  onClick, 
  variant = 'primary' 
}) => {
  const baseClasses = 'px-4 py-2 rounded-lg font-medium transition-colors';
  const variantClasses = {
    primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
    secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/90'
  };

  return (
    <button 
      className={\`\${baseClasses} \${variantClasses[variant]}\`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};`
          }
        ]
      },
      {
        name: "pages",
        type: "folder",
        path: "src/pages", 
        expanded: false,
        children: [
          { 
            name: "Home.tsx", 
            type: "file", 
            path: "src/pages/Home.tsx",
            content: `import { FC } from 'react';
import { Header } from '../components/Header';
import { Button } from '../components/Button';

export const Home: FC = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header title="Welcome to My App" />
      
      <main className="container mx-auto px-4 py-8">
        <div className="text-center space-y-6">
          <h2 className="text-3xl font-bold text-foreground">
            Build Something Amazing
          </h2>
          
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Start creating your next project with our powerful tools and 
            intuitive interface. Everything you need is right at your fingertips.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button variant="primary">Get Started</Button>
            <Button variant="secondary">Learn More</Button>
          </div>
        </div>
      </main>
    </div>
  );
};`
          }
        ]
      },
      { 
        name: "App.tsx", 
        type: "file", 
        path: "src/App.tsx",
        content: `import { FC } from 'react';
import { Home } from './pages/Home';

const App: FC = () => {
  return <Home />;
};

export default App;`
      },
      { 
        name: "main.tsx", 
        type: "file", 
        path: "src/main.tsx",
        content: `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);`
      }
    ]
  },
  {
    name: "package.json",
    type: "file",
    path: "package.json",
    content: `{
  "name": "ai-landing-page",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.15",
    "@types/react-dom": "^18.2.7",
    "@vitejs/plugin-react": "^4.0.3",
    "typescript": "^5.0.2",
    "vite": "^4.4.5"
  }
}`
  }
];

interface FileExplorerProps {
  files: FileNode[];
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
}

function FileTreeItem({ 
  node, 
  level = 0, 
  onFileSelect, 
  selectedFile 
}: { 
  node: FileNode; 
  level?: number; 
  onFileSelect: (file: FileNode) => void;
  selectedFile?: FileNode;
}) {
  const [expanded, setExpanded] = useState(node.expanded || false);

  const handleClick = () => {
    if (node.type === 'folder') {
      setExpanded(!expanded);
    } else {
      onFileSelect(node);
    }
  };

  const isSelected = selectedFile?.path === node.path;

  return (
    <div>
      <div 
        className={`flex items-center gap-1 py-1 px-2 rounded cursor-pointer text-sm hover:bg-sidebar-accent ${
          isSelected ? 'bg-sidebar-accent text-glow' : 'text-sidebar-foreground'
        }`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={handleClick}
      >
        {node.type === 'folder' && (
          expanded ? 
            <ChevronDown className="h-3 w-3" /> : 
            <ChevronRight className="h-3 w-3" />
        )}
        {node.type === 'folder' ? (
          <Folder className="h-4 w-4 text-blue-400 mr-1" />
        ) : (
          <File className="h-4 w-4 text-gray-400 mr-1" />
        )}
        <span>{node.name}</span>
      </div>
      
      {node.type === 'folder' && expanded && node.children && (
        <div>
          {node.children.map((child, index) => (
            <FileTreeItem 
              key={index} 
              node={child} 
              level={level + 1}
              onFileSelect={onFileSelect}
              selectedFile={selectedFile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function FileExplorer({ files, onFileSelect, selectedFile }: FileExplorerProps) {
  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
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
            className="w-full pl-7 pr-2 py-1 text-xs bg-surface border border-border rounded"
            placeholder="Search files..."
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 p-2">
        {files.map((file, index) => (
          <FileTreeItem 
            key={index} 
            node={file} 
            onFileSelect={onFileSelect}
            selectedFile={selectedFile}
          />
        ))}
      </ScrollArea>
    </div>
  );
}

interface CodeEditorProps {
  generatedCode?: string;
}

export default function CodeEditor({ generatedCode }: CodeEditorProps) {
  const [files] = useState<FileNode[]>(defaultFiles);
  const [selectedFile, setSelectedFile] = useState<FileNode | undefined>();
  const [openTabs, setOpenTabs] = useState<FileNode[]>([]);

  useEffect(() => {
    // Auto-select App.tsx on mount
    const appFile = findFileByPath(files, "src/App.tsx");
    if (appFile) {
      setSelectedFile(appFile);
      setOpenTabs([appFile]);
    }
  }, [files]);

  const findFileByPath = (nodes: FileNode[], path: string): FileNode | undefined => {
    for (const node of nodes) {
      if (node.path === path) return node;
      if (node.children) {
        const found = findFileByPath(node.children, path);
        if (found) return found;
      }
    }
    return undefined;
  };

  const handleFileSelect = (file: FileNode) => {
    setSelectedFile(file);
    if (!openTabs.find(tab => tab.path === file.path)) {
      setOpenTabs(prev => [...prev, file]);
    }
  };

  const closeTab = (file: FileNode) => {
    const newTabs = openTabs.filter(tab => tab.path !== file.path);
    setOpenTabs(newTabs);
    
    if (selectedFile?.path === file.path) {
      setSelectedFile(newTabs[newTabs.length - 1]);
    }
  };

  const getLanguageFromFileName = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'tsx':
      case 'ts': return 'typescript';
      case 'jsx':
      case 'js': return 'javascript';
      case 'css': return 'css';
      case 'json': return 'json';
      case 'html': return 'html';
      case 'md': return 'markdown';
      default: return 'typescript';
    }
  };

  return (
    <div className="h-full flex">
      {/* File Explorer */}
      <div className="w-64">
        <FileExplorer 
          files={files}
          onFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
      </div>

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        {/* Tabs */}
        {openTabs.length > 0 && (
          <div className="h-10 border-b border-border bg-surface flex items-center">
            <div className="flex items-center overflow-x-auto">
              {openTabs.map((tab) => (
                <div
                  key={tab.path}
                  className={`flex items-center gap-2 px-3 py-2 text-sm border-r border-border cursor-pointer ${
                    selectedFile?.path === tab.path 
                      ? 'bg-background text-foreground' 
                      : 'bg-surface text-muted-foreground hover:text-foreground'
                  }`}
                  onClick={() => setSelectedFile(tab)}
                >
                  <File className="h-3 w-3" />
                  <span>{tab.name}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 hover:bg-destructive/20"
                    onClick={(e) => {
                      e.stopPropagation();
                      closeTab(tab);
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor */}
        <div className="flex-1">
          {selectedFile ? (
            <Editor
              height="100%"
              language={getLanguageFromFileName(selectedFile.name)}
              value={generatedCode || selectedFile.content || '// Start coding...'}
              theme="vs-dark"
              options={{
                minimap: { enabled: false },
                fontSize: 14,
                lineNumbers: 'on',
                roundedSelection: false,
                scrollBeyondLastLine: false,
                automaticLayout: true,
                tabSize: 2,
                wordWrap: 'on'
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <File className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Select a file to start editing</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}