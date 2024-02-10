import React, { Suspense, useEffect, useState } from "react";
import { OrbitControls } from "@react-three/drei";
import { Canvas, useLoader } from "@react-three/fiber";
import { PerspectiveCamera } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MTLLoader } from "three/examples/jsm/loaders/MTLLoader";
import { useSiteContext } from "@/contexts/Site";
import { getDiscsByRpId } from "@/api/disc";
import axios from "axios";

type Urls = {
  obj: string;
  mtl: string;
};

type SceneProps = {
  urls: Urls;
};

function Scene({ urls }: SceneProps) {
  const mtl = useLoader(
    MTLLoader,
    `${process.env.NEXT_PUBLIC_MARBLE_API_ENDPOINT}${urls.mtl}`
  );
  const obj = useLoader(
    OBJLoader,
    `${process.env.NEXT_PUBLIC_MARBLE_API_ENDPOINT}${urls.obj}`,
    (loader) => {
      loader.setMaterials(mtl);
    }
  );

  return <primitive object={obj} />;
}

const DiscontinuitiesVisualization = () => {
  const [urls, setUrls] = useState<Urls | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const { selectedRP } = useSiteContext();
  const camera = new PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(100, 160, 200);

  useEffect(() => {
    selectedRP && loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const res = await getDiscsByRpId(selectedRP?._id);
    await fetchObj(res.data.discs);
    setLoading(false);
  };

  const fetchObj = async (discs: any) => {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_MARBLE_API_ENDPOINT}/disc`,
      {
        filename: selectedRP._id,
        positionX: selectedRP.sizeX,
        positionY: selectedRP.sizeY,
        positionZ: selectedRP.sizeZ,
        sizeX: selectedRP.sizeX,
        sizeY: selectedRP.sizeY,
        sizeZ: selectedRP.sizeZ,
        data: discs.map((d: any) => ({
          dip: d.dip,
          dipDirection: d.dipDirect,
          positionX: d.pX,
          positionY: d.pY,
          positionZ: d.pZ,
        })),
      }
    );
    setUrls({ obj: res.data.obj, mtl: res.data.mtl });
  };

  if (loading) {
    return (
      <div className="h-full flex justify-center items-center text-5xl font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-row h-full gap-5">
      {urls && (
        <Canvas camera={camera}>
          <directionalLight position={[-100, 300, -300]} intensity={1.2} />
          <directionalLight position={[100, 300, 300]} intensity={1.2} />
          <Suspense fallback={null}>
            <Scene urls={urls} />
          </Suspense>
          <axesHelper args={[125]} />
          <OrbitControls enablePan={true} makeDefault={true} />
        </Canvas>
      )}
    </div>
  );
};

export default DiscontinuitiesVisualization;
