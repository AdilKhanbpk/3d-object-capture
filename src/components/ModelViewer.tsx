import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Environment, Center } from "@react-three/drei";
import { Loader2 } from "lucide-react";

interface ModelViewerProps {
  url: string;
}

const Model = ({ url }: { url: string }) => {
  const { scene } = useGLTF(url);
  return (
    <Center>
      <primitive object={scene} />
    </Center>
  );
};

const ModelViewer = ({ url }: ModelViewerProps) => {
  return (
    <div className="w-full aspect-square rounded-xl overflow-hidden border border-border bg-muted">
      <Suspense
        fallback={
          <div className="w-full h-full flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        }
      >
        <Canvas camera={{ position: [0, 1, 3], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <Model url={url} />
          <OrbitControls enablePan enableZoom enableRotate />
          <Environment preset="studio" />
        </Canvas>
      </Suspense>
    </div>
  );
};

export default ModelViewer;
