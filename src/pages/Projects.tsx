import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ProjectCard } from "@/components/ProjectCard";
import { 
  Plus, 
  Search, 
  Filter,
  Grid3x3,
  List,
  Star,
  Clock
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const mockProjects = [
  {
    id: "1",
    name: "Portfolio Website",
    description: "A modern portfolio website showcasing my work and skills with beautiful animations.",
    status: "deployed" as const,
    lastModified: "2 hours ago",
    framework: "React",
    isStarred: true
  },
  {
    id: "2", 
    name: "E-commerce Platform",
    description: "Full-featured online store with payment integration and admin dashboard.",
    status: "building" as const,
    lastModified: "1 day ago",
    framework: "Next.js"
  },
  {
    id: "3",
    name: "Task Management App",
    description: "Collaborative task management tool with real-time updates and team features.",
    status: "draft" as const,
    lastModified: "3 days ago",
    framework: "React",
    isStarred: true
  },
  {
    id: "4",
    name: "Weather Dashboard",
    description: "Interactive weather dashboard with charts and location-based forecasts.",
    status: "deployed" as const,
    lastModified: "1 week ago",
    framework: "Vue.js"
  },
  {
    id: "5",
    name: "Blog Platform",
    description: "Content management system for bloggers with rich text editor and SEO optimization.",
    status: "draft" as const,
    lastModified: "2 weeks ago",
    framework: "React"
  },
  {
    id: "6",
    name: "Analytics Dashboard",
    description: "Real-time analytics dashboard with interactive charts and data visualization.",
    status: "building" as const,
    lastModified: "3 days ago",
    framework: "React"
  }
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const filteredProjects = mockProjects.filter(project =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedProjects = [...filteredProjects].sort((a, b) => {
    if (sortBy === "starred") {
      return (b.isStarred ? 1 : 0) - (a.isStarred ? 1 : 0);
    }
    return 0; // Default to original order for "recent"
  });

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">Projects</h1>
          <p className="text-muted-foreground">
            Manage and deploy your applications
          </p>
        </div>
        
        <Button variant="glow" className="gap-2">
          <Plus className="h-4 w-4" />
          New Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-2">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="recent">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Recent
                </div>
              </SelectItem>
              <SelectItem value="starred">
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4" />
                  Starred
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex rounded-lg border border-border">
            <Button
              variant={viewMode === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="rounded-r-none border-r"
            >
              <Grid3x3 className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="rounded-l-none"
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Projects Grid */}
      <div className={`grid gap-6 ${
        viewMode === "grid" 
          ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" 
          : "grid-cols-1"
      }`}>
        {sortedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>

      {filteredProjects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-muted-foreground mb-4">
            No projects found matching your search.
          </div>
          <Button variant="outline">
            Clear Search
          </Button>
        </div>
      )}
    </div>
  );
}