import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import ModelViewer from "@/components/ModelViewer";
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

const ViewerPage = () => {
  const { id } = useParams<{ id: string }>();
  const [model, setModel] = useState<{ name: string; file_url: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchModel = async () => {
      if (!id) return;
      const { data } = await supabase
        .from("models")
        .select("name, file_url")
        .eq("id", id)
        .single();
      setModel(data);
      setLoading(false);
    };
    fetchModel();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!model) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <p className="text-muted-foreground">Model not found</p>
        <Button variant="outline" asChild>
          <Link to="/"><ArrowLeft className="w-4 h-4 mr-2" /> Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild>
            <Link to="/"><ArrowLeft className="w-5 h-5" /></Link>
          </Button>
          <h1 className="text-2xl font-bold">{model.name}</h1>
        </div>
        <ModelViewer url={model.file_url} />
        <p className="text-sm text-muted-foreground text-center">
          Drag to rotate • Scroll to zoom • Shift+drag to pan
        </p>
      </div>
    </div>
  );
};

export default ViewerPage;
