"use client";

import { useEffect, useRef, useState, useCallback } from 'react';
import { Card } from '@/components/ui/card';
import * as THREE from 'three';
import dynamic from 'next/dynamic';
import GlobeLabel from './globe/globe-label';

const Globe = dynamic(() => import('./globe/globe-component'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[600px] flex items-center justify-center bg-background/95">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  )
});

interface Marker {
  name: string;
  state: string;
  country: string;
  postcode: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
}

interface Label {
  text: string;
  lat: number;
  lng: number;
  size: number;
  color: string;
  name: string;
  state: string;
  country: string;
  postcode: string;
}

interface InteractiveGlobeProps {
  searchResults: any;
}

export default function InteractiveGlobe({ searchResults }: InteractiveGlobeProps) {
  const [initialized, setInitialized] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [countries, setCountries] = useState<any>({ features: [] });
  const [markers, setMarkers] = useState<Marker[]>([]);
  const [labels, setLabels] = useState<Label[]>([]);
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const globeRef = useRef<any>(null);

  const handleResize = useCallback(() => {
    if (!mounted) return;
    const container = document.getElementById('globe-container');
    if (container) {
      setDimensions({
        width: container.clientWidth,
        height: Math.max(500, window.innerHeight * 0.6)
      });
    }
  }, [mounted]);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    const fetchCountries = async () => {
      try {
        const response = await fetch('https://unpkg.com/world-atlas/countries-110m.json');
        const data = await response.json();
        setCountries(data);
      } catch (error) {
        console.error('Failed to load country data:', error);
      }
    };

    fetchCountries();
    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, [handleResize, mounted]);

  useEffect(() => {
    if (!mounted || !searchResults?.places?.[0]) return;

    const place = searchResults.places[0];
    const lat = parseFloat(place.latitude);
    const lng = parseFloat(place.longitude);

    if (!isNaN(lat) && !isNaN(lng)) {
      const newMarker: Marker = {
        name: place["place name"],
        state: place.state,
        country: searchResults.country,
        postcode: searchResults["post code"],
        lat,
        lng,
        size: 0.5,
        color: '#ff4444'
      };

      const newLabel: Label = {
        text: `${place["place name"]}, ${searchResults["post code"]}`,
        lat,
        lng,
        size: 1,
        color: '#ffffff',
        name: place["place name"],
        state: place.state,
        country: searchResults.country,
        postcode: searchResults["post code"]
      };

      setMarkers([newMarker]);
      setLabels([newLabel]);

      if (globeRef.current && initialized) {
        globeRef.current.pointOfView({
          lat,
          lng,
          altitude: 1.5
        }, 1000);
      }
    }
  }, [searchResults, initialized, mounted]);

  if (!mounted) return null;

  return (
    <Card className="my-16 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div id="globe-container" className="relative w-full">
        <Globe
          globeRef={globeRef}
          width={dimensions.width}
          height={dimensions.height}
          globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
          bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
          backgroundImageUrl="//unpkg.com/three-globe/example/img/night-sky.png"
          atmosphereColor="rgb(200,230,255)"
          atmosphereAltitude={0.25}
          atmosphereGlow={0.1}
          pointsData={markers}
          pointAltitude={0.1}
          pointColor="color"
          pointRadius="size"
          pointsMerge={false}
          pointResolution={32}
          labelsData={labels}
          labelLat={d => d.lat}
          labelLng={d => d.lng}
          labelAltitude={0.1}
          labelRotation={0}
          labelSize={1.5}
          labelIncludeDot={true}
          labelDotRadius={0.5}
          labelColor={() => '#ffffff'}
          labelResolution={2}
          labelText="text"
          labelComponent={GlobeLabel}
          polygonsData={countries.features}
          polygonCapColor={() => '#1a1a1a'}
          polygonSideColor={() => '#242424'}
          polygonStrokeColor={() => '#333'}
          onGlobeReady={() => {
            setInitialized(true);
          }}
          rendererConfig={{
            antialias: true,
            alpha: true,
            logarithmicDepthBuffer: true
          }}
        />
        {mounted && (
          <div className="absolute bottom-4 right-4 bg-background/80 backdrop-blur-sm rounded-lg p-2 text-sm text-muted-foreground">
            <p>Drag to rotate • Scroll to zoom • Hover elements for details</p>
          </div>
        )}
      </div>
    </Card>
  );
}