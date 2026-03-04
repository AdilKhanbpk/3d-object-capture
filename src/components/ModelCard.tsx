import { useState } from "react";
import { Eye, QrCode, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { QRCodeSVG } from "qrcode.react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface ModelCardProps {
  id: string;
  name: string;
  fileUrl: string;
  createdAt: string;
  onDelete: () => void;
}

const ModelCard = ({ id, name, fileUrl, createdAt, onDelete }: ModelCardProps) => {
  const [deleting, setDeleting] = useState(false);
  const viewerUrl = `${window.location.origin}/view/${id}`;

  const handleDelete = async () => {
    setDeleting(true);
    const { error } = await supabase.from("models").delete().eq("id", id);
    if (error) {
      toast.error("Failed to delete");
    } else {
      toast.success("Model deleted");
      onDelete();
    }
    setDeleting(false);
  };

  return (
    <div className="p-4 rounded-xl border border-border bg-card space-y-3">
      <div className="flex items-start justify-between">
        <div>
          <h4 className="font-semibold text-lg">{name}</h4>
          <p className="text-xs text-muted-foreground">
            {new Date(createdAt).toLocaleDateString()}
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={handleDelete} disabled={deleting}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </div>

      <div className="flex gap-2">
        <Button variant="outline" size="sm" className="gap-1" asChild>
          <a href={`/view/${id}`}>
            <Eye className="w-4 h-4" /> View 3D
          </a>
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1">
              <QrCode className="w-4 h-4" /> QR Code
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>QR Code for "{name}"</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col items-center gap-4 py-4">
              <QRCodeSVG value={viewerUrl} size={200} />
              <p className="text-sm text-muted-foreground text-center break-all">
                {viewerUrl}
              </p>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default ModelCard;
