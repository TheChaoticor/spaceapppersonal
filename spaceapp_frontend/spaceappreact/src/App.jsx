import React, { useState, useEffect } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

function App() {
  const [neoData, setNeoData] = useState([]);
  
  useEffect(() => {
    // Initialize Three.js scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({
      canvas: document.getElementById('canvas'),
      antialias: true
    });

    // Set up camera and renderer
    camera.position.z = 5;
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // Add orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    // Load NEO data
    fetch('https://api.nasa.gov/neo/rest/v1/feed/today?api_key=vwjCcUbDbyTG2T2FfKL0A9eCXLNlZN85A2jIYbra')
      .then(response => response.json())
      .then(data => {
        const neoObjects = [];
        Object.keys(data.near_earth_objects).forEach(date => {
          data.near_earth_objects[date].forEach(neo => {
            const geometry = new THREE.SphereGeometry(0.1, 32, 32);
            const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
            const sphere = new THREE.Mesh(geometry, material);

            // Scale down the distance for visibility
            const distance = neo.close_approach_data[0].miss_distance.kilometers / 1000000;

            sphere.position.set(distance, Math.random() * 2 - 1, Math.random() * 2 - 1);
            neoObjects.push(sphere);
          });
        });

        // Add NEO objects to scene
        neoObjects.forEach(object => {
          scene.add(object);
        });

        setNeoData(data.near_earth_objects);

        // Render scene
        function animate() {
          requestAnimationFrame(animate);
          controls.update();
          renderer.render(scene, camera);
        }
        animate();
      });

    // Handle window resize
    const onWindowResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', onWindowResize, false);

    return () => {
      window.removeEventListener('resize', onWindowResize);
    };
  }, []);

  return (
    <div>
      <canvas id="canvas" style={{ width: '100vw', height: '100vh', display: 'block' }} />
      {neoData && Object.keys(neoData).length > 0 && (
        Object.keys(neoData).map(date =>
          neoData[date].map(neo => (
            <div key={neo.id}>
              <h2>{neo.name}</h2>
              <p>Close Approach Date: {neo.close_approach_data[0].close_approach_date}</p>
              <p>Miss Distance: {neo.close_approach_data[0].miss_distance.kilometers} km</p>
            </div>
          ))
        )
      )}
    </div>
  );
}

export default App;
