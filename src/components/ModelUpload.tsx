import { useState } from "react";
import { Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ModelUploadProps {
  onUploadComplete: () => void;
}

const ModelUpload = ({ onUploadComplete }: ModelUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (!file || !name.trim()) {
      toast.error("Please provide a name and select a file");
      return;
    }

    setUploading(true);
    try {
      const filePath = `${crypto.randomUUID()}_${file.name}`;
      const { error: storageError } = await supabase.storage
        .from("models")
        .upload(filePath, file);

      if (storageError) throw storageError;

      const { data: { publicUrl } } = supabase.storage
        .from("models")
        .getPublicUrl(filePath);

      const { error: dbError } = await supabase.from("models").insert({
        name: name.trim(),
        file_url: publicUrl,
      });

      if (dbError) throw dbError;

      toast.success("Model uploaded successfully!");
      setFile(null);
      setName("");
      onUploadComplete();
    } catch (err: any) {
      toast.error(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4 p-6 rounded-xl border border-border bg-card">
      <h3 className="text-lg font-semibold">Upload 3D Model</h3>
      <p className="text-sm text-muted-foreground">
        Upload .glb or .gltf files processed from your captured photos
      </p>
      <Input
        placeholder="Model name"
        value={name}
        onChange={e => setName(e.target.value)}
      />
      <div className="flex items-center gap-3">
        <label className="flex-1 cursor-pointer">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg border border-dashed border-border hover:border-primary transition-colors text-sm text-muted-foreground">
            <Upload className="w-4 h-4" />
            {file ? file.name : "Choose .glb / .gltf file"}
          </div>
          <input
            type="file"
            accept=".glb,.gltf"
            className="hidden"
            onChange={e => setFile(e.target.files?.[0] || null)}
          />
        </label>
        <Button onClick={handleUpload} disabled={uploading || !file || !name.trim()}>
          {uploading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Upload"}
        </Button>
      </div>
    </div>
  );
};

export default ModelUpload;
