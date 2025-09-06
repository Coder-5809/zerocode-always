import { Button } from "@/components/ui/button";
import { NavLink, useLocation } from "react-router-dom";
import { CreateProjectDialog } from "@/components/CreateProjectDialog";
import { 
  Code2, 
  FileText, 
  Folder, 
  GitBranch, 
  Home, 
  Layers, 
  Plus, 
  Search,
  Settings,
  Terminal
} from "lucide-react";

const sidebarItems = [
  { icon: Home, label: "Dashboard", path: "/", active: false },
  { icon: Code2, label: "Editor", path: "/editor", active: false },
  { icon: Folder, label: "Projects", path: "/projects", active: false },
  { icon: FileText, label: "Templates", path: "/templates", active: false },
  { icon: GitBranch, label: "Version Control", path: "#", active: false },
  { icon: Terminal, label: "Terminal", path: "#", active: false },
  { icon: Layers, label: "Deployments", path: "#", active: false },
  { icon: Settings, label: "Settings", path: "/settings", active: false },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 h-screen bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in">
      <div className="p-4 border-b border-sidebar-border">
        <CreateProjectDialog>
          <Button variant="glow" className="w-full justify-start gap-2">
            <Plus className="h-4 w-4" />
            New Project
          </Button>
        </CreateProjectDialog>
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
        {sidebarItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isDisabled = item.path === "#";
          
          if (isDisabled) {
            return (
              <div
                key={item.label}
                className="flex items-center gap-3 px-3 py-2 h-10 text-muted-foreground/50 cursor-not-allowed"
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </div>
            );
          }
          
          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive: navIsActive }) => `
                flex items-center gap-3 px-3 py-2 h-10 rounded-lg transition-colors
                ${navIsActive || isActive 
                  ? 'bg-glow/20 text-glow border border-glow/30' 
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
                }
              `}
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          );
        })}
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