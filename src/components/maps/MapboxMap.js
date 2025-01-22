import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

export default function MapboxMap({ latitude, longitude }) {
  const mapContainerRef = useRef(null);

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_MAPBOX_API_KEY && !process.env.MAPBOX_API_KEY) {
      console.error('Mapbox API key is not set.');
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_API_KEY || process.env.MAPBOX_API_KEY;
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [longitude, latitude],
      zoom: 10
    });

    new mapboxgl.Marker().setLngLat([longitude, latitude]).addTo(map);

    return () => map.remove();
  }, [latitude, longitude]);

  return <div ref={mapContainerRef} style={{ width: '100%', height: '100%' }} />;
}
