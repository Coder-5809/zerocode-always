import { Button } from "@/components/ui/button";
import { Code, Menu, Settings, User } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 border-b border-border bg-surface-elevated backdrop-blur-sm flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" className="lg:hidden">
          <Menu className="h-4 w-4" />
        </Button>
        
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Code className="h-4 w-4 text-primary-foreground" />
          </div>
          <h1 className="text-lg font-semibold text-foreground">ZeroCode</h1>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
        <Button variant="glow" size="sm">
          Deploy
        </Button>
      </div>
    </header>
  );
}