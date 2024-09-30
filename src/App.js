import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";
import './App.css';
import { Suspense, useEffect, useRef } from 'react';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function App() {
  return (
    <div className="App">
      <Canvas camera={{ position: [50, 80, 50] }}>
        <Suspense fallback={null}> 
          <ambientLight intensity={0.7} />
          <Modal />
        </Suspense>
        <OrbitControls />
      </Canvas>
    </div>
  );
}

function Modal() {
  const { scene, nodes } = useGLTF("/dell_3d_changi_campus_new_compressed.glb");
  const ref = useRef();

  useEffect(() => {
    // Calculate the bounding box and center the model after it loads
    const box = new THREE.Box3().setFromObject(scene); // Calculate bounding box
    const center = box.getCenter(new THREE.Vector3()); // Get the center of the bounding box
    scene.position.sub(center); // Center the model
  }, [scene]);

  console.log("nodes: ", nodes);
  console.log("scene: ", scene);

  return (
    <primitive object={scene} position={[0, 0, 0]} ref={ref} />
  );
}

export default App;
