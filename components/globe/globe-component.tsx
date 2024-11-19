"use client";

import { useEffect, forwardRef } from 'react';
import ReactGlobe from 'react-globe.gl';
import * as THREE from 'three';

interface GlobeProps {
  globeRef: any;
  [key: string]: any;
}

const GlobeComponent = forwardRef<any, GlobeProps>(({ globeRef, ...props }, _ref) => {
  useEffect(() => {
    if (globeRef?.current) {
      const ambientLight = new THREE.AmbientLight(0xbbbbbb, 0.3);
      globeRef.current.scene().add(ambientLight);
      
      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
      directionalLight.position.set(1, 1, 1);
      globeRef.current.scene().add(directionalLight);

      globeRef.current.pointOfView({
        lat: 20,
        lng: 0,
        altitude: 2.5
      });
    }
  }, [globeRef]);

  return <ReactGlobe ref={globeRef} {...props} />;
});

GlobeComponent.displayName = 'GlobeComponent';

export default GlobeComponent;