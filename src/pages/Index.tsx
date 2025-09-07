import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowRight, 
  Code, 
  Sparkles, 
  Zap,
  Users,
  Globe,
  CheckCircle,
  Star,
  PlayCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: <Code className="h-6 w-6" />,
    title: "Visual Code Builder",
    description: "Build applications with our intuitive drag-and-drop interface"
  },
  {
    icon: <Zap className="h-6 w-6" />,
    title: "Lightning Fast",
    description: "Deploy your applications in seconds, not hours"
  },
  {
    icon: <Users className="h-6 w-6" />,
    title: "Team Collaboration",
    description: "Work together with your team in real-time"
  },
  {
    icon: <Globe className="h-6 w-6" />,
    title: "Global Deployment",
    description: "Deploy worldwide with our edge network"
  }
];

const stats = [
  { value: "50K+", label: "Developers" },
  { value: "100K+", label: "Apps Built" },
  { value: "99.9%", label: "Uptime" },
  { value: "2.3s", label: "Avg Build Time" }
];

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-surface-elevated/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-glow">ZeroCode</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-foreground hover:text-glow transition-colors">Features</a>
              <a href="#pricing" className="text-foreground hover:text-glow transition-colors">Pricing</a>
              <a href="#docs" className="text-foreground hover:text-glow transition-colors">Docs</a>
              <Button variant="outline" size="sm">Sign In</Button>
              <Link to="/editor">
                <Button variant="glow" size="sm">Start Building</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-glow opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <Badge variant="secondary" className="mb-8 gap-2">
              <Sparkles className="h-4 w-4" />
              Now in Public Beta
            </Badge>
            
            <h1 className="text-6xl md:text-8xl font-bold mb-8 animate-fade-in">
              Build Apps{" "}
              <span className="text-glow animate-glow-pulse">Without Code</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto animate-fade-in">
              ZeroCode is the fastest way to build, deploy, and scale modern applications. 
              No coding required, infinite possibilities.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16 animate-fade-in">
              <Link to="/editor">
                <Button variant="glow" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Start Building Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg" className="gap-2">
                <PlayCircle className="h-5 w-5" />
                Watch Demo
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-3xl font-bold text-glow mb-1">{stat.value}</div>
                  <div className="text-muted-foreground text-sm">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-surface/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Everything you need to build
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From idea to production in minutes. Our platform handles the complexity 
              so you can focus on building amazing experiences.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="p-6 bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
                <div className="h-12 w-12 rounded-lg bg-gradient-primary flex items-center justify-center mb-4 text-primary-foreground group-hover:animate-glow-pulse">
                  {feature.icon}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                <p className="text-muted-foreground text-sm">{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Card className="p-12 bg-gradient-subtle border-border">
            <h2 className="text-4xl font-bold mb-4 text-foreground">
              Ready to start building?
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Join thousands of developers who are already building the future with ZeroCode.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <Link to="/editor">
                <Button variant="glow" size="lg" className="gap-2">
                  <Sparkles className="h-5 w-5" />
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Button variant="outline" size="lg">
                Talk to Sales
              </Button>
            </div>

            <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Free for 30 days
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                No credit card required
              </div>
              <div className="flex items-center gap-1">
                <CheckCircle className="h-4 w-4 text-green-400" />
                Cancel anytime
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-surface-elevated">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold text-glow">ZeroCode</span>
            </div>
            
            <div className="flex items-center gap-6 text-muted-foreground">
              <a href="#" className="hover:text-glow transition-colors">Privacy</a>
              <a href="#" className="hover:text-glow transition-colors">Terms</a>
              <a href="#" className="hover:text-glow transition-colors">Support</a>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-sm">Star us on GitHub</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;