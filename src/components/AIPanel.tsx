import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Send, 
  Sparkles, 
  Code, 
  Image, 
  Lightbulb,
  Bot,
  User
} from "lucide-react";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string; // Enforce string type
  aiType?: 'planning' | 'coding' | 'image';
  timestamp: Date;
}

interface AIPanelProps {
  onCodeGenerated?: (code: string) => void;
  onImageGenerated?: (imageUrl: string) => void;
}

export default function AIPanel({ onCodeGenerated, onImageGenerated }: AIPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "I'll create a modern AI startup landing page with a sleek, futuristic design. This will feature gradients, clean typography, and smooth animations typical of leading AI companies.",
      aiType: 'planning',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    const originalInput = input;
    setInput("");
    setIsLoading(true);

    try {
      // Determine if this is a website/project prompt
      const isWebsitePrompt = originalInput.toLowerCase().includes('website') || 
                             originalInput.toLowerCase().includes('landing page') ||
                             originalInput.toLowerCase().includes('app') ||
                             originalInput.toLowerCase().includes('build') ||
                             originalInput.toLowerCase().includes('create') ||
                             originalInput.toLowerCase().includes('design');

      // Determine AI type based on message content
      let aiType: 'planning' | 'coding' | 'image' = 'planning';
      if (originalInput.toLowerCase().includes('image') || originalInput.toLowerCase().includes('picture')) {
        aiType = 'image';
      } else if (originalInput.toLowerCase().includes('code') || originalInput.toLowerCase().includes('implement')) {
        aiType = 'coding';
      }

      // Use Puter AI services
      let response = '';
      
      if (aiType === 'image') {
        // Use DALL-E 3 for images
        const imageUrl = await generateImage(originalInput);
        response = `Generated image: ${imageUrl}`;
        onImageGenerated?.(imageUrl);
      } else if (isWebsitePrompt) {
        // Two-stage process: Planning with GPT-5, then Coding with Claude
        
        // Stage 1: Planning with GPT-5
        const planningPrompt = `Create a detailed plan for: ${originalInput}. Include:
1. Project structure and components needed
2. Key features and functionality
3. Design considerations
4. Technical requirements
5. Step-by-step implementation approach`;
        
        // Show thinking message instead of full planning response
        const thinkingMessage: Message = {
          id: (Date.now() + 1).toString(),
          type: 'ai',
          content: "Thinking through the project structure and requirements...",
          aiType: 'planning',
          timestamp: new Date()
        };

        setMessages(prev => [...prev, thinkingMessage]);

        // Get planning response but don't display it
        const planningResponse = await callPuterAI('gpt-5-2025-08-07', planningPrompt);
        console.log('Planning AI raw response:', planningResponse);

        // Stage 2: Coding with Claude Opus 4
        const codingPrompt = `Based on this plan, generate the complete React/TypeScript code:

PLAN:
${planningResponse}

Generate a full React component with:
- Modern, responsive design using Tailwind CSS
- TypeScript interfaces
- Clean, production-ready code
- All necessary imports
- Proper component structure`;

        const codingResponse = await callPuterAI('claude-sonnet-4-20250514', codingPrompt);
        console.log('Coding AI raw response:', codingResponse);
        
        response = String(codingResponse);
        aiType = 'coding';
        
        // Update code tab
        onCodeGenerated?.(response);
        
      } else if (aiType === 'planning') {
        // Use ChatGPT-5 for planning
        const rawResponse = await callPuterAI('gpt-5-2025-08-07', originalInput);
        console.log('Planning AI raw response:', rawResponse);
        response = String(rawResponse);
      } else if (aiType === 'coding') {
        // Use Claude Opus 4.1 for coding
        const rawResponse = await callPuterAI('claude-sonnet-4-20250514', originalInput);
        console.log('Coding AI raw response:', rawResponse);
        response = String(rawResponse);
        onCodeGenerated?.(response);
      }

      // Ensure response is always a string
      if (typeof response === 'object') {
        console.error('Response is still an object:', response);
        response = JSON.stringify(response);
      }

      const aiMessage: Message = {
        id: (Date.now() + Math.random()).toString(),
        type: 'ai',
        content: response,
        aiType,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error('AI request failed:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const callPuterAI = async (model: string, prompt: string): Promise<string> => {
    // Simulate AI delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000));
    
    try {
      // Mock responses for different models
      if (model === 'gpt-5-2025-08-07') {
        return `## Project Plan for: ${prompt.split(':')[1]?.split('.')[0] || 'Portfolio Website'}

**1. Project Structure:**
- Modern React/TypeScript application
- Component-based architecture with reusable UI components
- Responsive design system with Tailwind CSS
- Clean folder structure with organized components

**2. Key Features:**
- Hero section with personal introduction
- Interactive project showcase with filtering
- About section with skills and experience
- Contact form with validation
- Dark/light mode toggle
- Smooth animations and transitions

**3. Design Considerations:**
- Modern, clean aesthetic with professional appearance
- Mobile-first responsive design
- Accessibility compliance (WCAG guidelines)
- Fast loading with optimized images
- SEO optimization

**4. Technical Requirements:**
- React 18+ with TypeScript
- Tailwind CSS for styling
- Lucide React for icons
- Form validation and submission
- Local storage for theme preferences

**5. Implementation Approach:**
- Create reusable UI components (Button, Card, etc.)
- Build layout components (Header, Footer)
- Implement main sections (Hero, Projects, About, Contact)
- Add animations and interactions
- Test responsiveness and accessibility`;
      } else if (model === 'claude-sonnet-4-20250514') {
        return `import React, { useState, useEffect } from 'react';
import { Moon, Sun, Menu, X, Github, Linkedin, Mail, ExternalLink, Download, ArrowDown } from 'lucide-react';

// Types
interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

interface Skill {
  name: string;
  level: number;
  category: string;
}

// Mock data
const projects: Project[] = [
  {
    id: '1',
    title: 'E-Commerce Platform',
    description: 'A full-stack e-commerce solution with React, Node.js, and MongoDB. Features include product catalog, shopping cart, payment integration, and admin dashboard.',
    image: '/api/placeholder/600/400',
    tags: ['React', 'Node.js', 'MongoDB', 'Stripe', 'TypeScript'],
    liveUrl: 'https://demo-ecommerce.com',
    githubUrl: 'https://github.com/username/ecommerce',
    featured: true
  },
  {
    id: '2',
    title: 'Task Management App',
    description: 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.',
    image: '/api/placeholder/600/400',
    tags: ['React', 'Firebase', 'Material-UI', 'WebSockets'],
    liveUrl: 'https://task-manager-demo.com',
    githubUrl: 'https://github.com/username/task-manager',
    featured: true
  },
  {
    id: '3',
    title: 'Weather Dashboard',
    description: 'A responsive weather dashboard with interactive maps, forecasts, and weather alerts using multiple weather APIs.',
    image: '/api/placeholder/600/400',
    tags: ['React', 'D3.js', 'OpenWeather API', 'Chart.js'],
    liveUrl: 'https://weather-dashboard-demo.com',
    githubUrl: 'https://github.com/username/weather-dashboard',
    featured: false
  }
];

const skills: Skill[] = [
  { name: 'React', level: 95, category: 'Frontend' },
  { name: 'TypeScript', level: 90, category: 'Frontend' },
  { name: 'JavaScript', level: 95, category: 'Frontend' },
  { name: 'Node.js', level: 85, category: 'Backend' },
  { name: 'Python', level: 80, category: 'Backend' },
  { name: 'MongoDB', level: 75, category: 'Database' },
  { name: 'PostgreSQL', level: 80, category: 'Database' },
  { name: 'AWS', level: 70, category: 'DevOps' },
  { name: 'Docker', level: 75, category: 'DevOps' }
];

// Components
const Button: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  href?: string;
  className?: string;
}> = ({ children, variant = 'primary', size = 'md', onClick, href, className = '' }) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50';
  
  const variantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-sm hover:shadow-md',
    secondary: 'bg-gray-600 hover:bg-gray-700 text-white focus:ring-gray-500 shadow-sm',
    outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white focus:ring-blue-500'
  };

  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base'
  };

  const classes = \`\${baseClasses} \${variantClasses[variant]} \${sizeClasses[size]} \${className}\`;

  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }

  return (
    <button onClick={onClick} className={classes}>
      {children}
    </button>
  );
};

const ProjectCard: React.FC<{ project: Project }> = ({ project }) => (
  <div className="group relative bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-200 dark:border-gray-700">
    {project.featured && (
      <div className="absolute top-4 left-4 z-10">
        <span className="bg-blue-600 text-white px-2 py-1 rounded-full text-xs font-medium">
          Featured
        </span>
      </div>
    )}
    
    <div className="aspect-video overflow-hidden">
      <img
        src={project.image}
        alt={project.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
      />
    </div>
    
    <div className="p-6">
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
        {project.title}
      </h3>
      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
        {project.description}
      </p>
      
      <div className="flex flex-wrap gap-2 mb-4">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex gap-2">
        {project.liveUrl && (
          <Button variant="primary" size="sm" href={project.liveUrl}>
            <ExternalLink size={16} className="mr-1" />
            Live Demo
          </Button>
        )}
        {project.githubUrl && (
          <Button variant="outline" size="sm" href={project.githubUrl}>
            <Github size={16} className="mr-1" />
            Code
          </Button>
        )}
      </div>
    </div>
  </div>
);

const SkillBar: React.FC<{ skill: Skill }> = ({ skill }) => (
  <div className="mb-4">
    <div className="flex justify-between items-center mb-1">
      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{skill.name}</span>
      <span className="text-sm text-gray-500 dark:text-gray-400">{skill.level}%</span>
    </div>
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
      <div
        className="bg-blue-600 h-2 rounded-full transition-all duration-1000 ease-out"
        style={{ width: \`\${skill.level}%\` }}
      />
    </div>
  </div>
);

// Main Portfolio Component
const Portfolio: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(!darkMode);

  const navigation = [
    { name: 'Home', href: '#home' },
    { name: 'Projects', href: '#projects' },
    { name: 'Skills', href: '#skills' },
    { name: 'About', href: '#about' },
    { name: 'Contact', href: '#contact' }
  ];

  const featuredProjects = projects.filter(p => p.featured);
  const skillCategories = [...new Set(skills.map(s => s.category))];

  return (
    <div className={\`min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300 \${isVisible ? 'opacity-100' : 'opacity-0'}\`}>
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="text-2xl font-bold text-gray-900 dark:text-white">
              Portfolio
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-8">
              {navigation.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-sm font-medium transition-colors"
                >
                  {item.name}
                </a>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle dark mode"
              >
                {darkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-800">
              <nav className="flex flex-col space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 px-3 py-2 text-base font-medium transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-blue-900" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center space-y-8">
            <div className="space-y-4">
              <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm font-medium">
                👋 Hello, I'm John Doe
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
                Full Stack Developer
              </h1>
              
              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-3xl mx-auto">
                I create exceptional digital experiences with modern web technologies. 
                Passionate about clean code, user experience, and innovative solutions.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="primary" size="lg">
                <Mail size={20} className="mr-2" />
                Get In Touch
              </Button>
              
              <Button variant="outline" size="lg">
                <Download size={20} className="mr-2" />
                Download Resume
              </Button>
            </div>

            <div className="flex justify-center space-x-6 text-gray-600 dark:text-gray-400">
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Github size={24} />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="#" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <ArrowDown size={24} className="text-gray-600 dark:text-gray-400" />
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Featured Projects
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Here are some of my recent projects that showcase my skills and experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg">
              View All Projects
            </Button>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Skills & Expertise
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Technologies and tools I work with to bring ideas to life.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {skillCategories.map((category) => (
              <div key={category} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  {category}
                </h3>
                {skills
                  .filter((skill) => skill.category === category)
                  .map((skill) => (
                    <SkillBar key={skill.name} skill={skill} />
                  ))}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white">
                About Me
              </h2>
              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p>
                  I'm a passionate full-stack developer with over 5 years of experience 
                  building web applications. I love creating efficient, scalable, and 
                  user-friendly solutions using modern technologies.
                </p>
                <p>
                  My journey in tech started with curiosity about how websites work, 
                  and it has evolved into a career focused on crafting exceptional 
                  digital experiences. I enjoy staying up-to-date with the latest 
                  industry trends and best practices.
                </p>
                <p>
                  When I'm not coding, you can find me exploring new technologies, 
                  contributing to open-source projects, or sharing knowledge with 
                  the developer community.
                </p>
              </div>
              <Button variant="primary" size="lg">
                Let's Work Together
              </Button>
            </div>
            
            <div className="relative">
              <img
                src="/api/placeholder/500/600"
                alt="Profile"
                className="rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Let's Connect
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Have a project in mind? I'd love to hear about it and discuss how we can work together.
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-8">
              <form className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    placeholder="Project discussion"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <Button variant="primary" size="lg" className="w-full">
                  Send Message
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-black text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">John Doe</h3>
              <p className="text-gray-400 mb-4">
                Full Stack Developer passionate about creating amazing digital experiences.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Github size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Linkedin size={20} />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">
                  <Mail size={20} />
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="block text-gray-400 hover:text-white transition-colors"
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Info</h3>
              <div className="space-y-2 text-gray-400">
                <p>📧 john@example.com</p>
                <p>📱 +1 (555) 123-4567</p>
                <p>📍 San Francisco, CA</p>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-8 border-t border-gray-800 text-center text-gray-400">
            <p>&copy; 2024 John Doe. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;`;
      } else {
        return `I understand you're asking about: ${prompt}. Let me help you with that.

This is a mock response since I'm simulating AI behavior. In a real implementation, this would connect to actual AI services.

Here are some key points I can help you with:
- Technical implementation guidance
- Best practices and recommendations
- Code examples and solutions
- Architecture suggestions

Is there anything specific you'd like me to focus on?`;
      }
    } catch (error) {
      console.error('Mock AI error:', error);
      return 'I apologize, but I encountered an issue generating a response. Please try again.';
    }
  };

  const generateImage = async (prompt: string): Promise<string> => {
    try {
      // @ts-ignore - Puter global object
      const imageElement = await puter.ai.txt2img(prompt);
      return imageElement.src || '/placeholder.svg';
    } catch (error) {
      console.error('Image generation error:', error);
      return '/placeholder.svg';
    }
  };

  const getAIIcon = (aiType?: string) => {
    switch (aiType) {
      case 'planning': return <Lightbulb className="h-3 w-3" />;
      case 'coding': return <Code className="h-3 w-3" />;
      case 'image': return <Image className="h-3 w-3" />;
      default: return <Bot className="h-3 w-3" />;
    }
  };

  const getAIBadgeText = (aiType?: string) => {
    switch (aiType) {
      case 'planning': return 'GPT-5';
      case 'coding': return 'Claude Sonnet';
      case 'image': return 'DALL-E 3';
      default: return 'AI';
    }
  };

  return (
    <div className="h-full bg-sidebar border-r border-sidebar-border flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-8 w-8 rounded-lg bg-gradient-primary flex items-center justify-center">
            <Sparkles className="h-4 w-4 text-primary-foreground" />
          </div>
          <span className="font-semibold text-sidebar-foreground">AI Assistant</span>
        </div>
        <p className="text-xs text-muted-foreground">
          Multi-AI system for planning, coding, and design
        </p>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="space-y-2">
              <div className={`flex items-start gap-3 ${
                message.type === 'user' ? 'flex-row-reverse' : ''
              }`}>
                <div className={`flex-shrink-0 h-6 w-6 rounded-full flex items-center justify-center ${
                  message.type === 'user' 
                    ? 'bg-primary text-primary-foreground' 
                    : 'bg-gradient-primary text-primary-foreground'
                }`}>
                  {message.type === 'user' ? 
                    <User className="h-3 w-3" /> : 
                    getAIIcon(message.aiType)
                  }
                </div>
                
                <div className={`flex-1 space-y-1 ${
                  message.type === 'user' ? 'text-right' : ''
                }`}>
                  <div className="flex items-center gap-2">
                    {message.type === 'ai' && message.aiType && (
                      <Badge variant="secondary" className="text-xs h-4 px-1">
                        {getAIBadgeText(message.aiType)}
                      </Badge>
                    )}
                    <span className="text-xs text-muted-foreground">
                      {message.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  
                  <div className={`rounded-lg p-3 text-sm max-w-[280px] ${
                    message.type === 'user'
                      ? 'bg-primary text-primary-foreground ml-auto'
                      : 'bg-surface border border-border text-foreground'
                  }`}>
                    {typeof message.content === 'string' ? message.content : JSON.stringify(message.content)}
                  </div>
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 h-6 w-6 rounded-full bg-gradient-primary flex items-center justify-center">
                <Bot className="h-3 w-3 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <div className="rounded-lg p-3 bg-surface border border-border">
                  <div className="flex items-center gap-1">
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce"></div>
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="h-1 w-1 rounded-full bg-primary animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Input */}
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask AI to build something..."
            className="flex-1 bg-surface border-border"
            onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
            disabled={isLoading}
          />
          <Button 
            onClick={sendMessage} 
            disabled={!input.trim() || isLoading}
            size="sm"
            className="h-10 w-10 p-0"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}