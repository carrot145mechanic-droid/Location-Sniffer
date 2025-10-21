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
      background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px'
      }}>
        <div style={{ fontSize: '3rem', marginBottom: '15px' }}>🌍❄️</div>
        <h1 style={{ fontSize: '2.5rem', marginBottom: '10px' }}>Climate Solutions Australia</h1>
        <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>Soluții personalizate de ventilație și climatizare</p>
        <p style={{ opacity: 0.8, marginTop: '5px' }}>
          Harta noastră interactivă vă ajută să găsiți soluțiile perfecte pentru zona dvs.
        </p>
      </div>

      {/* Main Content */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: '30px',
        padding: '20px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Map Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          overflow: 'hidden',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          height: '500px',
          position: 'relative'
        }}>
          <MapComponent 
            userLocation={userLocation}
            onMapReady={(map) => console.log('Map ready:', map)}
          />
        </div>

        {/* Info Section */}
        <div style={{
          background: 'white',
          borderRadius: '15px',
          padding: '30px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
          color: '#333'
        }}>
          <h2 style={{ color: '#2d3748', marginBottom: '20px' }}>🏭 Servicii Specializate</h2>
          
          {[
            { icon: '💨', title: 'Ventilație Industrială', desc: 'Sisteme profesionale adaptate nevoilor specifice ale zonei dvs.' },
            { icon: '❄️', title: 'Climatizare Commercială', desc: 'Soluții eficiente bazate pe condițiile climatice locale' },
            { icon: '🌡️', title: 'Analiză Climatică', desc: 'Studii personalizate pentru eficiență maximă în regiunea dvs.' },
            { icon: '🔧', title: 'Instalații Regionale', desc: 'Servicii de instalare adaptate particularităților geografice' }
          ].map((service, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '20px',
              padding: '15px',
              background: '#f8f9fa',
              borderRadius: '10px'
            }}>
              <div style={{ fontSize: '2rem', marginRight: '15px' }}>{service.icon}</div>
              <div>
                <h3 style={{ marginBottom: '5px' }}>{service.title}</h3>
                <p style={{ color: '#666' }}>{service.desc}</p>
              </div>
            </div>
          ))}

          <LocationTracker onLocationDetected={handleLocationDetected} />
        </div>
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        marginTop: '50px',
        opacity: 0.9
      }}>
        <p>© 2024 Climate Solutions Australia. Toate drepturile rezervate.</p>
        <p>📞 1800-CLIMATE | 📧 info@climatesolutions-au.com</p>
      </div>
    </div>
  );
};

export default MainPage;