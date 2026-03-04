import { useEffect, useState, useCallback } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Camera, Upload, Box } from "lucide-react";
import CameraCapture from "@/components/CameraCapture";
import ModelUpload from "@/components/ModelUpload";
import ModelCard from "@/components/ModelCard";
import { supabase } from "@/integrations/supabase/client";

interface Model {
  id: string;
  name: string;
  file_url: string;
  created_at: string;
}

const Index = () => {
  const [models, setModels] = useState<Model[]>([]);

  const fetchModels = useCallback(async () => {
    const { data } = await supabase
      .from("models")
      .select("*")
      .order("created_at", { ascending: false });
    setModels((data as Model[]) || []);
  }, []);

  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border px-4 py-4 md:px-8">
        <div className="max-w-5xl mx-auto flex items-center gap-3">
          <Box className="w-7 h-7 text-primary" />
          <h1 className="text-xl font-bold tracking-tight">3D Scanner</h1>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        <Tabs defaultValue="capture" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="capture" className="gap-2">
              <Camera className="w-4 h-4" /> Capture Photos
            </TabsTrigger>
            <TabsTrigger value="upload" className="gap-2">
              <Upload className="w-4 h-4" /> Upload Model
            </TabsTrigger>
          </TabsList>

          <TabsContent value="capture" className="mt-6">
            <CameraCapture />
          </TabsContent>

          <TabsContent value="upload" className="mt-6">
            <ModelUpload onUploadComplete={fetchModels} />
          </TabsContent>
        </Tabs>

        {models.length > 0 && (
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Your 3D Models</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {models.map(m => (
                <ModelCard
                  key={m.id}
                  id={m.id}
                  name={m.name}
                  fileUrl={m.file_url}
                  createdAt={m.created_at}
                  onDelete={fetchModels}
                />
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default Index;
