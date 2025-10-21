import { useState } from 'react';
import MapComponent from '../components/MapComponent';
import LocationTracker from '../components/LocationTracker';

const MainPage = () => {
  const [userLocation, setUserLocation] = useState(null);

  const handleLocationDetected = (coords) => {
    setUserLocation(coords);
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Minimalist */}
      <div style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: 'white'
      }}>
        <div style={{ 
          fontSize: '2.5rem', 
          marginBottom: '10px',
          opacity: 0.9
        }}>📍</div>
        <h1 style={{ 
          fontSize: '1.8rem', 
          marginBottom: '8px',
          fontWeight: 600,
          letterSpacing: '-0.02em'
        }}>Interactive Map</h1>
        <p style={{ 
          fontSize: '1rem', 
          opacity: 0.8,
          maxWidth: '400px',
          margin: '0 auto',
          lineHeight: 1.4
        }}>
          See your location on the map and explore nearby points of interest
        </p>
      </div>

      {/* Main Content - Full Width Map */}
      <div style={{
        padding: '0 20px 40px 20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Map Container */}
        <div style={{
          background: 'white',
          borderRadius: '20px',
          overflow: 'hidden',
          boxShadow: '0 20px 60px rgba(0,0,0,0.15)',
          height: '65vh',
          minHeight: '500px',
          marginBottom: '25px',
          position: 'relative'
        }}>
          <MapComponent 
            userLocation={userLocation}
            onMapReady={(map) => console.log('Map ready:', map)}
          />
        </div>

        {/* Location Tracker - Integrated */}
        <LocationTracker onLocationDetected={handleLocationDetected} />
      </div>

      {/* Minimal Footer */}
      <div style={{
        textAlign: 'center',
        padding: '30px 20px',
        color: 'white',
        opacity: 0.7,
        fontSize: '0.9rem'
      }}>
        <p>© 2024 Interactive Map. All rights reserved.</p>
      </div>
    </div>
  );
};

export default MainPage;