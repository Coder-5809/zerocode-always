import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Search, 
  Filter,
  Star,
  Eye,
  Download,
  Code,
  Palette,
  ShoppingCart,
  Users,
  FileText,
  Zap,
  Globe,
  Briefcase
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const categories = [
  { id: "all", name: "All Templates", icon: Globe },
  { id: "landing", name: "Landing Pages", icon: Zap },
  { id: "portfolio", name: "Portfolio", icon: Briefcase },
  { id: "ecommerce", name: "E-commerce", icon: ShoppingCart },
  { id: "blog", name: "Blog", icon: FileText },
  { id: "dashboard", name: "Dashboard", icon: Palette },
  { id: "saas", name: "SaaS", icon: Users },
  { id: "admin", name: "Admin Panel", icon: Code }
];

const templates = [
  {
    id: "1",
    name: "Modern Portfolio",
    description: "Clean and minimalist portfolio template perfect for designers and developers.",
    category: "portfolio",
    framework: "React",
    image: "/api/placeholder/400/250",
    rating: 4.9,
    downloads: "12.3k",
    tags: ["Portfolio", "Minimal", "Dark Theme"],
    featured: true
  },
  {
    id: "2",
    name: "SaaS Landing Page",
    description: "High-converting landing page template for SaaS products with pricing sections.",
    category: "landing",
    framework: "Next.js",
    image: "/api/placeholder/400/250",
    rating: 4.8,
    downloads: "8.7k",
    tags: ["SaaS", "Landing", "Pricing"]
  },
  {
    id: "3",
    name: "E-commerce Store",
    description: "Complete e-commerce solution with product catalog and shopping cart functionality.",
    category: "ecommerce",
    framework: "React",
    image: "/api/placeholder/400/250",
    rating: 4.7,
    downloads: "15.2k",
    tags: ["E-commerce", "Shopping", "Products"],
    featured: true
  },
  {
    id: "4",
    name: "Analytics Dashboard",
    description: "Modern dashboard template with charts, metrics, and data visualization components.",
    category: "dashboard",
    framework: "Vue.js",
    image: "/api/placeholder/400/250",
    rating: 4.9,
    downloads: "9.1k",
    tags: ["Dashboard", "Analytics", "Charts"]
  },
  {
    id: "5",
    name: "Blog Template",
    description: "Beautiful blog template with markdown support and responsive design.",
    category: "blog",
    framework: "React",
    image: "/api/placeholder/400/250",
    rating: 4.6,
    downloads: "5.4k",
    tags: ["Blog", "Markdown", "CMS"]
  },
  {
    id: "6",
    name: "Admin Panel",
    description: "Comprehensive admin panel with user management and data tables.",
    category: "admin",
    framework: "React",
    image: "/api/placeholder/400/250",
    rating: 4.8,
    downloads: "7.8k",
    tags: ["Admin", "Management", "Tables"],
    featured: true
  }
];

export default function Templates() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [sortBy, setSortBy] = useState("popular");

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || template.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedTemplates = [...filteredTemplates].sort((a, b) => {
    if (sortBy === "popular") return parseInt(b.downloads) - parseInt(a.downloads);
    if (sortBy === "rating") return b.rating - a.rating;
    return a.name.localeCompare(b.name);
  });

  const featuredTemplates = templates.filter(t => t.featured);

  return (
    <div className="p-8 max-w-7xl mx-auto animate-fade-in">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
        <p className="text-muted-foreground">
          Start your project with beautiful, pre-built templates
        </p>
      </div>

      {/* Featured Templates */}
      <div className="mb-12">
        <h2 className="text-xl font-semibold text-foreground mb-6 flex items-center gap-2">
          <Star className="h-5 w-5 text-yellow-400" />
          Featured Templates
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredTemplates.map((template) => (
            <Card key={template.id} className="overflow-hidden bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
              <div className="aspect-video bg-surface relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-glow opacity-20"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Code className="h-16 w-16 text-glow/50" />
                </div>
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                    Featured
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-foreground mb-2 group-hover:text-glow transition-colors">
                  {template.name}
                </h3>
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {template.description}
                </p>
                <div className="flex items-center gap-2 mb-3">
                  {template.tags.slice(0, 2).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                      {template.rating}
                    </div>
                    <div className="flex items-center gap-1">
                      <Download className="h-3 w-3" />
                      {template.downloads}
                    </div>
                  </div>
                  <Button variant="glow" size="sm">
                    Use Template
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>
        
        <div className="flex gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="rating">Highest Rated</SelectItem>
              <SelectItem value="name">Name A-Z</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Categories Sidebar */}
        <div className="w-64 flex-shrink-0">
          <h3 className="font-semibold text-foreground mb-4">Categories</h3>
          <div className="space-y-1">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                  selectedCategory === category.id 
                    ? 'bg-glow/20 text-glow border border-glow/30' 
                    : 'hover:bg-surface-elevated text-muted-foreground hover:text-foreground'
                }`}
              >
                <category.icon className="h-4 w-4" />
                <span className="text-sm">{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Templates Grid */}
        <div className="flex-1">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedTemplates.map((template) => (
              <Card key={template.id} className="overflow-hidden bg-surface-elevated border-border hover:border-glow/50 transition-all duration-300 group">
                <div className="aspect-video bg-surface relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-surface"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Code className="h-12 w-12 text-glow/30" />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70">
                      <Eye className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-foreground group-hover:text-glow transition-colors">
                      {template.name}
                    </h3>
                    <Badge variant="outline" className="text-xs">
                      {template.framework}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {template.description}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {template.tags.map((tag) => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-400 fill-yellow-400" />
                        {template.rating}
                      </div>
                      <div className="flex items-center gap-1">
                        <Download className="h-3 w-3" />
                        {template.downloads}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      Use Template
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {sortedTemplates.length === 0 && (
            <div className="text-center py-12">
              <div className="text-muted-foreground mb-4">
                No templates found matching your criteria.
              </div>
              <Button variant="outline" onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}>
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}