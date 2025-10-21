import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix pentru marker-ele Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const MapComponent = ({ userLocation, onMapReady }) => {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);
  const userMarker = useRef(null);
  const accuracyCircle = useRef(null);

  useEffect(() => {
    // Initializează harta
    if (!mapInstance.current && mapRef.current) {
      mapInstance.current = L.map(mapRef.current).setView([-25.2744, 133.7751], 4);
      
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
        maxZoom: 18
      }).addTo(mapInstance.current);

      // Adaugă marker-e pentru servicii în Australia
      const serviceLocations = [
        { lat: -33.8688, lng: 151.2093, city: 'Sydney' },
        { lat: -37.8136, lng: 144.9631, city: 'Melbourne' },
        { lat: -27.4698, lng: 153.0251, city: 'Brisbane' },
        { lat: -31.9505, lng: 115.8605, city: 'Perth' },
        { lat: -34.9285, lng: 138.6007, city: 'Adelaide' }
      ];

      serviceLocations.forEach(location => {
        L.marker([location.lat, location.lng])
          .addTo(mapInstance.current)
          .bindPopup(`<b>${location.city}</b><br>Servicii active în zonă`);
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

      // Adaugă noul marker
      userMarker.current = L.marker([userLocation.latitude, userLocation.longitude])
        .addTo(mapInstance.current)
        .bindPopup('<b>Locația dvs.</b><br>Acoperire verificată în această zonă')
        .openPopup();

      // Adaugă cerc de acuratețe
      accuracyCircle.current = L.circle([userLocation.latitude, userLocation.longitude], {
        color: 'red',
        fillColor: '#f03',
        fillOpacity: 0.2,
        radius: userLocation.accuracy
      }).addTo(mapInstance.current);

      // Centrează harta pe utilizator
      mapInstance.current.setView([userLocation.latitude, userLocation.longitude], 13);
    }
  }, [userLocation]);

  return <div ref={mapRef} style={{ height: '100%', width: '100%' }} />;
};

export default MapComponent;