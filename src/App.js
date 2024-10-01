import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF } from "@react-three/drei";
import './App.css';
import { Suspense, useEffect, useRef, useState } from 'react';
import { OrbitControls, Text } from '@react-three/drei';
import * as THREE from 'three';

function App() {
  const [panelClicked, setPanelClicked] = useState(false); // State to track if the panel is clicked

  // Function to handle the state change
  const handlePanelClick = (isClicked) => {
    setPanelClicked(isClicked);
  };

  return (
    <div className="App">
      <Canvas camera={{ position: [50, 80, 50] }}>
        <Suspense fallback={null}>
          <ambientLight intensity={2.1} />
          {/* <directionalLight position={[5, 5, 5]} intensity={10} castShadow={true}/> */}
          {/* <DirectionalLightHelper position={[5, 10, 50]} /> */}
          {/* <DirectionalLightHelper position={[0, 20, 20]} /> */}
          <Modal  onPanelClick={handlePanelClick} />
          <Text position={[-23,25,10]} fontSize={2} color={"black"} anchorX="right" anchorY="top" rotation={[-Math.PI / 2, 0, 0]} visible={panelClicked}>Solar Panel</Text>
        </Suspense>
        <OrbitControls />
      </Canvas>
      {/* {panelClicked && <p style={{position: "absolute", top: 0, left: 0, color: "black"}}>Solar Panel was clicked</p>}  */}
    </div>
  );
}

function Modal({ onPanelClick }) { // Receive the prop
  const { scene, nodes } = useGLTF("/dell_3d_changi_campus_new_compressed.glb");
  const ref = useRef();

  useFrame(() => {
    // Calculate the bounding box and center the model after it loads
    const box = new THREE.Box3().setFromObject(nodes["Scene"]); // Calculate bounding box
    const center = box.getCenter(new THREE.Vector3()); // Get the center of the bounding box
    nodes["Scene"].position.sub(center); // Center the model
  }, [nodes["Scene"]]);

  // console.log("nodes: ", nodes);

  const handleClick = (event) => {
    event.stopPropagation();
    if (event.intersections.length) {
      const clickedObject = event.intersections[0].object;
      // console.log("ClickedObject: ",clickedObject);
      if (clickedObject === nodes["data_sit_02_83"] || clickedObject === nodes["data_sit_02_82"]) {
        onPanelClick(prevState=>!prevState); // Call the function to update the parent state
      }
    }
  };

  return (
    <>
    <primitive object={nodes["Scene"]} position={[0, 0, 0]} ref={ref} onClick={handleClick} castShadow={true} />
    </>
  );
}
function DirectionalLightHelper({ position }) {
  const lightRef = useRef();

  useEffect(() => {
    if (lightRef.current) {
      const helper = new THREE.DirectionalLightHelper(lightRef.current, 5); // 5 is the size of the helper
      lightRef.current.add(helper);
    }
  }, [lightRef]);

  return <directionalLight ref={lightRef} position={position} intensity={2.1} castShadow   shadow-mapSize-width={1024}   // default is 512
  shadow-mapSize-height={1024}  // default is 512
  shadow-bias={-0.0001}  />;
}

export default App;
