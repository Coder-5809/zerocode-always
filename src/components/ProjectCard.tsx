import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  MoreVertical, 
  Globe, 
  GitBranch, 
  Clock,
  Star,
  Trash2,
  Edit,
  ExternalLink
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    status: "deployed" | "building" | "draft";
    lastModified: string;
    framework: string;
    isStarred?: boolean;
  };
}

export function ProjectCard({ project }: ProjectCardProps) {
  const statusColors = {
    deployed: "bg-green-500/20 text-green-400 border-green-500/30",
    building: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
    draft: "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };

  return (
    <Card className="p-6 bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-foreground group-hover:text-glow transition-colors">
            {project.name}
          </h3>
          {project.isStarred && (
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          )}
        </div>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Star className="mr-2 h-4 w-4" />
              {project.isStarred ? "Unstar" : "Star"}
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ExternalLink className="mr-2 h-4 w-4" />
              View Live
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
        {project.description}
      </p>

      <div className="flex items-center gap-2 mb-4">
        <Badge 
          variant="outline" 
          className={`text-xs ${statusColors[project.status]}`}
        >
          {project.status === "deployed" && <Globe className="mr-1 h-3 w-3" />}
          {project.status === "building" && <GitBranch className="mr-1 h-3 w-3" />}
          {project.status === "draft" && <Clock className="mr-1 h-3 w-3" />}
          {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
        </Badge>
        
        <Badge variant="secondary" className="text-xs">
          {project.framework}
        </Badge>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground">
          Updated {project.lastModified}
        </span>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="glow" size="sm">
            Deploy
          </Button>
        </div>
      </div>
    </Card>
  );
}