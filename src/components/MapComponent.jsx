import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom minimalist marker
const createCustomIcon = () => {
  return L.divIcon({
    className: 'custom-marker',
    html: `
      <div style="
        width: 24px;
        height: 24px;
        background: #667eea;
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 10px rgba(0,0,0,0.3);
      "></div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12]
  });
};

const MapComponent = ({ userLocation, onMapReady }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const userMarker = useRef(null);
  const accuracyCircle = useRef(null);

  useEffect(() => {
    // Initializează harta centrată pe Europa
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([48.8566, 2.3522], 5); // Paris, zoom 5
      
      // Tile layer minimalist (poți schimba stilul aici)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
        attribution: '© OpenStreetMap, © CartoDB',
        maxZoom: 18,
        subdomains: 'abcd'
      }).addTo(mapInstance.current);

      // Adaugă câteva marker-e elegante în Europa
      const europeanCities = [
        { lat: 48.8566, lng: 2.3522, city: 'Paris' },
        { lat: 51.5074, lng: -0.1278, city: 'London' },
        { lat: 52.5200, lng: 13.4050, city: 'Berlin' },
        { lat: 41.9028, lng: 12.4964, city: 'Rome' },
        { lat: 52.3676, lng: 4.9041, city: 'Amsterdam' },
        { lat: 50.0755, lng: 14.4378, city: 'Prague' }
      ];

      europeanCities.forEach(location => {
        L.marker([location.lat, location.lng], { 
          icon: createCustomIcon() 
        })
          .addTo(mapInstance.current)
          .bindPopup(`<div style="font-family: system-ui; padding: 5px;"><b>${location.city}</b></div>`);
      });

      if (onMapReady) {
        onMapReady(mapInstance.current);
      }
    }
  }, [onMapReady]);

  useEffect(() => {
    // Afișează utilizatorul pe hartă când se primește locația
    if (userLocation && mapInstance.current) {
      // Șterge marker-ul anterior
      if (userMarker.current) {
        mapInstance.current.removeLayer(userMarker.current);
      }
      if (accuracyCircle.current) {
        mapInstance.current.removeLayer(accuracyCircle.current);
      }

      // Adaugă noul marker cu stil personalizat
      userMarker.current = L.marker([userLocation.latitude, userLocation.longitude], {
        icon: L.divIcon({
          className: 'user-marker',
          html: `
            <div style="
              width: 32px;
              height: 32px;
              background: #e53e3e;
              border: 4px solid white;
              border-radius: 50%;
              box-shadow: 0 4px 15px rgba(229, 62, 62, 0.4);
              animation: pulse 1.5s infinite;
            "></div>
            <style>
              @keyframes pulse {
                0% { transform: scale(1); opacity: 1; }
                50% { transform: scale(1.1); opacity: 0.8; }
                100% { transform: scale(1); opacity: 1; }
              }
            </style>
          `,
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        })
      })
        .addTo(mapInstance.current)
        .bindPopup(`
          <div style="font-family: system-ui; padding: 8px; min-width: 120px;">
            <div style="font-weight: 600; margin-bottom: 4px;">📍 Your Location</div>
            <div style="font-size: 11px; color: #666;">
              Lat: ${userLocation.latitude.toFixed(6)}<br>
              Lng: ${userLocation.longitude.toFixed(6)}
            </div>
          </div>
        `)
        .openPopup();

      // Adaugă cerc de acuratețe subtil
      accuracyCircle.current = L.circle([userLocation.latitude, userLocation.longitude], {
        color: '#e53e3e',
        fillColor: '#e53e3e',
        fillOpacity: 0.1,
        weight: 1,
        radius: userLocation.accuracy
      }).addTo(mapInstance.current);

      // Centrează harta pe utilizator cu zoom mai apropiat
      mapInstance.current.setView([userLocation.latitude, userLocation.longitude], 14);
    }
  }, [userLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;