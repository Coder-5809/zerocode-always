import { Button } from "@/components/ui/button";
import { 
  Code2, 
  FileText, 
  Folder, 
  GitBranch, 
  Home, 
  Layers, 
  Plus, 
  Search,
  Terminal
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", active: true },
  { icon: Code2, label: "Editor", active: false },
  { icon: Folder, label: "Projects", active: false },
  { icon: FileText, label: "Templates", active: false },
  { icon: GitBranch, label: "Version Control", active: false },
  { icon: Terminal, label: "Terminal", active: false },
  { icon: Layers, label: "Deployments", active: false },
];

export function Sidebar() {
  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in">
      <div className="p-4 border-b border-sidebar-border">
        <Button variant="glow" className="w-full justify-start gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      <div className="p-4 border-b border-sidebar-border">
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search projects..."
            className="w-full pl-9 pr-3 py-2 bg-input border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        {sidebarItems.map((item) => (
          <Button
            key={item.label}
            variant={item.active ? "secondary" : "ghost"}
            className="w-full justify-start gap-3 h-10"
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </Button>
        ))}
      </nav>

      <div className="p-4 border-t border-sidebar-border">
        <div className="text-xs text-muted-foreground mb-2">Recent Projects</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer">
            <div className="h-2 w-2 rounded-full bg-glow animate-glow-pulse"></div>
            <span className="text-sm text-sidebar-foreground">Portfolio Site</span>
          </div>
          <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-sidebar-accent cursor-pointer">
            <div className="h-2 w-2 rounded-full bg-muted"></div>
            <span className="text-sm text-sidebar-foreground">E-commerce App</span>
          </div>
        </div>
      </div>
    </aside>
  );
}