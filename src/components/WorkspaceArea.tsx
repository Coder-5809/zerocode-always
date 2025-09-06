import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  ArrowRight, 
  Clock, 
  Code, 
  Globe, 
  PlayCircle, 
  Sparkles 
} from "lucide-react";

export function WorkspaceArea() {
  return (
    <main className="flex-1 bg-background overflow-auto">
      <div className="p-8 max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="mb-12 text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-glow opacity-50"></div>
            <h1 className="relative text-5xl font-bold mb-4 text-foreground animate-fade-in">
              Welcome to <span className="text-glow">ZeroCode</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground mb-8 animate-fade-in">
            Build beautiful applications without writing a single line of code
          </p>
          <div className="flex gap-4 justify-center animate-fade-in">
            <Button variant="glow" size="lg" className="gap-2">
              <Sparkles className="h-5 w-5" />
              Start Building
              <ArrowRight className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="lg" className="gap-2">
              <PlayCircle className="h-5 w-5" />
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="p-6 bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-gradient-primary flex items-center justify-center group-hover:animate-glow-pulse">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Active Projects</h3>
                <p className="text-sm text-muted-foreground">3 running</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-glow">12</div>
          </Card>

          <Card className="p-6 bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center group-hover:animate-glow-pulse">
                <Globe className="h-5 w-5 text-glow" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Deployments</h3>
                <p className="text-sm text-muted-foreground">This month</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-glow">47</div>
          </Card>

          <Card className="p-6 bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center group-hover:animate-glow-pulse">
                <Clock className="h-5 w-5 text-glow" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Build Time</h3>
                <p className="text-sm text-muted-foreground">Average</p>
              </div>
            </div>
            <div className="text-2xl font-bold text-glow">2.3s</div>
          </Card>
        </div>

        {/* Code Preview Area */}
        <Card className="p-8 bg-surface-elevated border-border">
          <div className="text-center">
            <div className="relative inline-block mb-6">
              <div className="h-32 w-32 rounded-full bg-gradient-glow animate-glow-pulse mx-auto flex items-center justify-center">
                <Code className="h-16 w-16 text-glow" />
              </div>
            </div>
            
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Generating preview...
            </h3>
            <p className="text-muted-foreground mb-6 max-w-md mx-auto">
              Your application is being compiled and optimized. This usually takes just a few seconds.
            </p>
            
            <div className="flex justify-center gap-2 mb-6">
              <div className="h-2 w-2 rounded-full bg-glow animate-bounce"></div>
              <div className="h-2 w-2 rounded-full bg-glow animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="h-2 w-2 rounded-full bg-glow animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>

            <Button variant="outline" size="sm">
              Cancel Build
            </Button>
          </div>
        </Card>
      </div>
    </main>
  );
}