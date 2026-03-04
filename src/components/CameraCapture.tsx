import { useRef, useState, useCallback } from "react";
import { Camera, Download, RotateCcw, Image } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CapturedPhoto {
  id: string;
  dataUrl: string;
  label: string;
}

const ANGLES = [
  "Front", "Front-Right", "Right", "Back-Right",
  "Back", "Back-Left", "Left", "Front-Left", "Top", "Bottom"
];

const CameraCapture = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [streaming, setStreaming] = useState(false);
  const [photos, setPhotos] = useState<CapturedPhoto[]>([]);
  const [currentAngle, setCurrentAngle] = useState(0);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment", width: 1920, height: 1080 },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setStreaming(true);
      }
    } catch (err) {
      console.error("Camera access denied:", err);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current?.srcObject) {
      (videoRef.current.srcObject as MediaStream).getTracks().forEach(t => t.stop());
      videoRef.current.srcObject = null;
      setStreaming(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (!videoRef.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d")?.drawImage(videoRef.current, 0, 0);
    const dataUrl = canvas.toDataURL("image/png");
    const label = ANGLES[currentAngle] || `Angle ${currentAngle + 1}`;
    setPhotos(prev => [...prev, { id: crypto.randomUUID(), dataUrl, label }]);
    setCurrentAngle(prev => prev + 1);
  }, [currentAngle]);

  const downloadAll = useCallback(() => {
    photos.forEach((photo, i) => {
      const a = document.createElement("a");
      a.href = photo.dataUrl;
      a.download = `capture_${photo.label.replace(/\s/g, "_")}_${i + 1}.png`;
      a.click();
    });
  }, [photos]);

  const reset = useCallback(() => {
    setPhotos([]);
    setCurrentAngle(0);
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative aspect-video rounded-xl overflow-hidden bg-muted border border-border">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        {!streaming && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Button variant="default" size="lg" onClick={startCamera} className="gap-2">
              <Camera className="w-5 h-5" /> Start Camera
            </Button>
          </div>
        )}
        {streaming && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-3">
            <Button onClick={capturePhoto} size="lg" className="gap-2">
              <Camera className="w-5 h-5" />
              Capture {ANGLES[currentAngle] || `#${currentAngle + 1}`}
            </Button>
            <Button variant="outline" onClick={stopCamera}>
              Stop
            </Button>
          </div>
        )}
      </div>

      {streaming && currentAngle < ANGLES.length && (
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Position the object showing the <span className="font-bold text-accent-foreground">{ANGLES[currentAngle]}</span> side
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {currentAngle}/{ANGLES.length} photos captured
          </p>
        </div>
      )}

      {photos.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">{photos.length} Photos Captured</h3>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset} className="gap-1">
                <RotateCcw className="w-4 h-4" /> Reset
              </Button>
              <Button size="sm" onClick={downloadAll} className="gap-1">
                <Download className="w-4 h-4" /> Download All
              </Button>
            </div>
          </div>
          <div className="grid grid-cols-5 gap-2">
            {photos.map(photo => (
              <div key={photo.id} className="relative group rounded-lg overflow-hidden border border-border">
                <img src={photo.dataUrl} alt={photo.label} className="w-full aspect-square object-cover" />
                <div className="absolute bottom-0 inset-x-0 bg-background/80 text-xs text-center py-1 font-medium">
                  {photo.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
