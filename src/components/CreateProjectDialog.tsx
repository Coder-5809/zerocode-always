import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { 
  Plus, 
  Code, 
  Palette, 
  ShoppingCart, 
  FileText,
  Users,
  Briefcase,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const templates = [
  {
    id: "blank",
    name: "Blank Project",
    description: "Start from scratch with a minimal setup",
    icon: Code,
    framework: "React",
    popular: false
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your work with a professional portfolio",
    icon: Briefcase,
    framework: "React",
    popular: true
  },
  {
    id: "landing",
    name: "Landing Page",
    description: "High-converting landing page template",
    icon: Globe,
    framework: "Next.js",
    popular: true
  },
  {
    id: "ecommerce",
    name: "E-commerce",
    description: "Online store with product catalog",
    icon: ShoppingCart,
    framework: "React",
    popular: false
  },
  {
    id: "blog",
    name: "Blog",
    description: "Content-focused blog template",
    icon: FileText,
    framework: "React",
    popular: false
  },
  {
    id: "dashboard",
    name: "Dashboard",
    description: "Analytics and data visualization",
    icon: Palette,
    framework: "React",
    popular: true
  },
  {
    id: "saas",
    name: "SaaS Platform",
    description: "Complete SaaS application starter",
    icon: Users,
    framework: "Next.js",
    popular: false
  }
];

interface CreateProjectDialogProps {
  children: React.ReactNode;
}

export function CreateProjectDialog({ children }: CreateProjectDialogProps) {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState("");
  const [projectName, setProjectName] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [framework, setFramework] = useState("");
  const { toast } = useToast();

  const handleCreate = () => {
    if (!projectName.trim()) {
      toast({
        title: "Project name required",
        description: "Please enter a name for your project.",
        variant: "destructive",
      });
      return;
    }

    // Simulate project creation
    toast({
      title: "Project created!",
      description: `${projectName} has been created successfully.`,
    });
    
    setOpen(false);
    setStep(1);
    setSelectedTemplate("");
    setProjectName("");
    setProjectDescription("");
    setFramework("");
  };

  const selectedTemplateData = templates.find(t => t.id === selectedTemplate);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto bg-surface-elevated border-border">
        <DialogHeader>
          <DialogTitle className="text-2xl text-foreground">
            {step === 1 ? "Choose a Template" : "Project Details"}
          </DialogTitle>
          <DialogDescription>
            {step === 1 
              ? "Select a template to get started quickly, or start from scratch."
              : "Configure your new project settings."
            }
          </DialogDescription>
        </DialogHeader>

        {step === 1 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <Card
                  key={template.id}
                  className={`p-4 cursor-pointer transition-all duration-300 hover:border-glow/50 ${
                    selectedTemplate === template.id 
                      ? 'border-glow bg-glow/10' 
                      : 'border-border bg-surface hover:bg-surface-elevated'
                  }`}
                  onClick={() => setSelectedTemplate(template.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      selectedTemplate === template.id 
                        ? 'bg-glow text-primary-foreground' 
                        : 'bg-surface-elevated'
                    }`}>
                      <template.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={`font-semibold text-sm ${
                          selectedTemplate === template.id ? 'text-glow' : 'text-foreground'
                        }`}>
                          {template.name}
                        </h3>
                        {template.popular && (
                          <Badge variant="secondary" className="text-xs">
                            Popular
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                        {template.description}
                      </p>
                      <Badge variant="outline" className="text-xs">
                        {template.framework}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            {selectedTemplateData && (
              <Card className="p-4 bg-surface border-border">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-glow flex items-center justify-center">
                    <selectedTemplateData.icon className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">{selectedTemplateData.name}</h3>
                    <p className="text-sm text-muted-foreground">{selectedTemplateData.description}</p>
                  </div>
                </div>
              </Card>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="projectName">Project Name *</Label>
                  <Input
                    id="projectName"
                    placeholder="My Awesome Project"
                    value={projectName}
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="framework">Framework</Label>
                  <Select value={framework} onValueChange={setFramework}>
                    <SelectTrigger>
                      <SelectValue placeholder="Choose framework" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="react">React</SelectItem>
                      <SelectItem value="nextjs">Next.js</SelectItem>
                      <SelectItem value="vue">Vue.js</SelectItem>
                      <SelectItem value="svelte">Svelte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="projectDescription">Description</Label>
                <Textarea
                  id="projectDescription"
                  placeholder="Describe your project..."
                  className="min-h-[120px]"
                  value={projectDescription}
                  onChange={(e) => setProjectDescription(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {step === 2 && (
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
          )}
          {step === 1 ? (
            <Button 
              variant="glow" 
              onClick={() => setStep(2)}
              disabled={!selectedTemplate}
            >
              Continue
            </Button>
          ) : (
            <Button variant="glow" onClick={handleCreate}>
              <Plus className="h-4 w-4 mr-2" />
              Create Project
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}