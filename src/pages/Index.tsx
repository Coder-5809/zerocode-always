import { Header } from "@/components/Header";
import { Sidebar } from "@/components/Sidebar";
import { WorkspaceArea } from "@/components/WorkspaceArea";

const Index = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <WorkspaceArea />
      </div>
    </div>
  );
};

export default Index;
