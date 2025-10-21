import { useState, useEffect } from 'react';
import { loadLocalData, clearLocalData } from '../utils/database';

const AdminPanel = () => {
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    loadVisitors();
  }, []);

  const loadVisitors = () => {
    const data = loadLocalData();
    setVisitors(data);
  };

  const handleClearData = () => {
    if (confirm('Sigur vrei să ștergi toate datele locale?')) {
      clearLocalData();
      setVisitors([]);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert('✅ Copiat: ' + text);
    });
  };

  const openMap = (lat, lng) => {
    const mapsUrl = `https://www.google.com/maps?q=${lat},${lng}&z=17`;
    window.open(mapsUrl, '_blank');
  };

  // Filtrează locațiile unice
  const uniqueLocations = visitors.filter((visit, index, self) => 
    visit.locationAllowed && 
    visit.coordinates &&
    index === self.findIndex(v => 
      v.coordinates && 
      v.coordinates.latitude.toFixed(4) === visit.coordinates.latitude.toFixed(4) &&
      v.coordinates.longitude.toFixed(4) === visit.coordinates.longitude.toFixed(4)
    )
  );

  // Statistici
  const stats = {
    total: visitors.length,
    allowed: visitors.filter(v => v.locationAllowed).length,
    denied: visitors.filter(v => !v.locationAllowed).length,
    uniqueLocations: uniqueLocations.length,
    mobile: visitors.filter(v => v.device && v.device.type === 'mobile').length,
    desktop: visitors.filter(v => v.device && v.device.type === 'desktop').length
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '16px',
          marginBottom: '24px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
          border: '1px solid #e2e8f0'
        }}>
          <h1 style={{ 
            color: '#1a202c', 
            marginBottom: '8px',
            fontSize: '2rem',
            fontWeight: 700
          }}>📊 Admin Dashboard</h1>
          <p style={{ 
            color: '#718096',
            fontSize: '1.1rem'
          }}>Location Tracking Analytics</p>
        </div>

        {/* Statistics Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px',
          marginBottom: '32px'
        }}>
          {[
            { label: 'Total Visitors', value: stats.total, color: '#4a5568', icon: '👥' },
            { label: 'Location Allowed', value: stats.allowed, color: '#38a169', icon: '✅' },
            { label: 'Location Denied', value: stats.denied, color: '#e53e3e', icon: '❌' },
            { label: 'Unique Locations', value: stats.uniqueLocations, color: '#3182ce', icon: '📍' },
            { label: 'Mobile Users', value: stats.mobile, color: '#d69e2e', icon: '📱' },
            { label: 'Desktop Users', value: stats.desktop, color: '#805ad5', icon: '💻' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                fontSize: '2.5rem',
                marginBottom: '8px'
              }}>{stat.icon}</div>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '4px',
                color: stat.color
              }}>
                {stat.value}
              </div>
              <div style={{ 
                color: '#718096',
                fontSize: '0.9rem',
                fontWeight: 500
              }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '12px',
          marginBottom: '24px',
          flexWrap: 'wrap'
        }}>
          <button
            onClick={loadVisitors}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#5a67d8'}
            onMouseLeave={(e) => e.target.style.background = '#667eea'}
          >
            🔄 Refresh Data
          </button>
          <button
            onClick={() => window.open('https://pipedream.com', '_blank')}
            style={{
              background: '#38a169',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#2f855a'}
            onMouseLeave={(e) => e.target.style.background = '#38a169'}
          >
            🌐 Open Pipedream
          </button>
          <button
            onClick={handleClearData}
            style={{
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '12px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '14px',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => e.target.style.background = '#c53030'}
            onMouseLeave={(e) => e.target.style.background = '#e53e3e'}
          >
            🗑️ Clear Local Data
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '12px 12px 0 0',
          overflow: 'hidden',
          marginBottom: 0,
          border: '1px solid #e2e8f0',
          borderBottom: 'none'
        }}>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: '👥 All Visitors', icon: '👥' },
              { id: 'unique', label: '📍 Unique Locations', icon: '📍' },
              { id: 'devices', label: '📱 Devices', icon: '📱' },
              { id: 'pipedream', label: '🌐 Pipedream', icon: '🌐' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '16px 24px',
                  background: activeTab === tab.id ? 'white' : '#f7fafc',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  fontSize: '14px',
                  borderBottom: activeTab === tab.id ? '3px solid #667eea' : 'none',
                  color: activeTab === tab.id ? '#2d3748' : '#718096',
                  transition: 'all 0.2s',
                  flex: 1,
                  minWidth: '120px'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'white',
          padding: '32px',
          borderRadius: '0 0 12px 12px',
          minHeight: '400px',
          border: '1px solid #e2e8f0',
          borderTop: 'none'
        }}>
          {activeTab === 'all' && (
            <div>
              <h3 style={{ 
                marginBottom: '24px', 
                color: '#2d3748',
                fontSize: '1.5rem'
              }}>All Visitor Data</h3>
              {visitors.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  color: '#718096',
                  padding: '60px 20px'
                }}>
                  <div style={{ fontSize: '3rem', marginBottom: '16px' }}>📭</div>
                  <p>No visitor data yet.</p>
                </div>
              ) : (
                <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                  {visitors.reverse().map((visit, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#f8f9fa',
                        borderLeft: `4px solid ${visit.locationAllowed ? '#38a169' : '#e53e3e'}`,
                        padding: '20px',
                        margin: '16px 0',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0'
                      }}
                    >
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'flex-start',
                        marginBottom: '12px'
                      }}>
                        <div>
                          <strong style={{ fontSize: '1.1rem' }}>{visit.friend}</strong> 
                          <span style={{ color: '#718096', marginLeft: '8px' }}>({visit.friendCode})</span>
                        </div>
                        <div style={{
                          background: visit.locationAllowed ? '#c6f6d5' : '#fed7d7',
                          color: visit.locationAllowed ? '#22543d' : '#742a2a',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          {visit.locationAllowed ? '✅ Location Allowed' : '❌ Location Denied'}
                        </div>
                      </div>

                      <div style={{ 
                        color: '#718096', 
                        marginBottom: '12px',
                        fontSize: '14px'
                      }}>
                        <strong>🕐</strong> {visit.timestamp}
                      </div>

                      {visit.locationAllowed && visit.coordinates ? (
                        <div style={{
                          background: '#e9ecef',
                          padding: '16px',
                          borderRadius: '8px',
                          margin: '12px 0',
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          <strong>📍 Exact Coordinates:</strong>
                          <div style={{ marginTop: '8px' }}>
                            <strong>Lat:</strong> {visit.coordinates.latitude.toFixed(6)}
                            <br />
                            <strong>Lng:</strong> {visit.coordinates.longitude.toFixed(6)}
                            {visit.coordinates.accuracy && (
                              <>
                                <br />
                                <strong>Accuracy:</strong> ±{Math.round(visit.coordinates.accuracy)} meters
                              </>
                            )}
                          </div>
                          <div style={{ 
                            display: 'flex', 
                            gap: '6px', 
                            marginTop: '12px',
                            flexWrap: 'wrap'
                          }}>
                            <button
                              onClick={() => copyToClipboard(visit.coordinates.latitude.toFixed(6))}
                              style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                            >
                              📋 Copy Lat
                            </button>
                            <button
                              onClick={() => copyToClipboard(visit.coordinates.longitude.toFixed(6))}
                              style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                            >
                              📋 Copy Lng
                            </button>
                            <button
                              onClick={() => openMap(visit.coordinates.latitude, visit.coordinates.longitude)}
                              style={{
                                background: '#38a169',
                                color: 'white',
                                border: 'none',
                                padding: '6px 12px',
                                borderRadius: '4px',
                                fontSize: '11px',
                                cursor: 'pointer'
                              }}
                            >
                              🗺️ View on Map
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          background: '#e9ecef',
                          padding: '16px',
                          borderRadius: '8px',
                          margin: '12px 0',
                          fontFamily: 'monospace',
                          fontSize: '13px'
                        }}>
                          <strong>🌐 IP Address:</strong> {visit.ip}
                          <button
                            onClick={() => copyToClipboard(visit.ip)}
                            style={{
                              background: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              padding: '6px 12px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              marginLeft: '8px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Copy IP
                          </button>
                        </div>
                      )}

                      {/* Device & Battery Info */}
                      <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '12px',
                        marginTop: '12px'
                      }}>
                        {visit.device && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            <strong>📱 Device:</strong> 
                            <div style={{ marginTop: '4px' }}>
                              • Type: {visit.device.type}
                              <br />• OS: {visit.device.os}
                              <br />• Browser: {visit.device.browser}
                              {visit.device.cores !== 'unknown' && (
                                <>
                                  <br />• Cores: {visit.device.cores}
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        {visit.battery && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            <strong>🔋 Battery:</strong>
                            <div style={{ marginTop: '4px' }}>
                              • Level: {visit.battery.level}%
                              <br />• Charging: {visit.battery.charging ? 'Yes' : 'No'}
                            </div>
                          </div>
                        )}

                        {visit.connection && (
                          <div style={{ fontSize: '12px', color: '#666' }}>
                            <strong>📶 Connection:</strong>
                            <div style={{ marginTop: '4px' }}>
                              • Type: {visit.connection.effectiveType}
                              {visit.connection.downlink !== 'unknown' && (
                                <>
                                  <br />• Speed: {visit.connection.downlink} Mbps
                                </>
                              )}
                            </div>
                          </div>
                        )}

                        <div style={{ fontSize: '12px', color: '#666' }}>
                          <strong>🖥️ Display:</strong>
                          <div style={{ marginTop: '4px' }}>
                            • Screen: {visit.screenResolution}
                            <br />• Language: {visit.language}
                            <br />• Timezone: {visit.timezone}
                          </div>
                        </div>
                      </div>

                      <div style={{ 
                        marginTop: '12px', 
                        fontSize: '11px', 
                        color: '#999',
                        borderTop: '1px solid #e2e8f0',
                        paddingTop: '8px'
                      }}>
                        <strong>User Agent:</strong> {visit.userAgent}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'unique' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#2d3748' }}>Unique Locations</h3>
              {uniqueLocations.length === 0 ? (
                <p style={{ color: '#718096' }}>No unique locations found.</p>
              ) : (
                <div style={{ display: 'grid', gap: '16px' }}>
                  {uniqueLocations.map((visit, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '20px'
                      }}
                    >
                      <strong>📍 Location #{index + 1}</strong>
                      <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>
                        <strong>👤 Visitor:</strong> {visit.friend} ({visit.friendCode})
                        <br /><strong>🕐 Time:</strong> {visit.timestamp}
                        <br /><strong>🌐 IP:</strong> {visit.ip}
                      </div>
                      <div style={{
                        background: '#f8f9fa',
                        padding: '12px',
                        borderRadius: '6px',
                        margin: '12px 0',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}>
                        <strong>Coordinates:</strong>
                        <br />Lat: {visit.coordinates.latitude.toFixed(6)}
                        <br />Lng: {visit.coordinates.longitude.toFixed(6)}
                        <div style={{ marginTop: '8px' }}>
                          <button
                            onClick={() => copyToClipboard(visit.coordinates.latitude.toFixed(6))}
                            style={{
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              marginRight: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Lat
                          </button>
                          <button
                            onClick={() => copyToClipboard(visit.coordinates.longitude.toFixed(6))}
                            style={{
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              marginRight: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Lng
                          </button>
                          <button
                            onClick={() => copyToClipboard(`${visit.coordinates.latitude.toFixed(6)}, ${visit.coordinates.longitude.toFixed(6)}`)}
                            style={{
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              marginRight: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Both
                          </button>
                          <button
                            onClick={() => copyToClipboard(visit.ip)}
                            style={{
                              background: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              marginRight: '4px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 IP
                          </button>
                          <button
                            onClick={() => openMap(visit.coordinates.latitude, visit.coordinates.longitude)}
                            style={{
                              background: '#38a169',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            🗺️ Map
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'devices' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#2d3748' }}>Device Analytics</h3>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '20px'
              }}>
                {/* Device Types */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ marginBottom: '16px', color: '#2d3748' }}>📱 Device Types</h4>
                  {[
                    { type: 'mobile', count: stats.mobile, color: '#4299e1' },
                    { type: 'desktop', count: stats.desktop, color: '#48bb78' },
                    { type: 'tablet', count: visitors.filter(v => v.device && v.device.type === 'tablet').length, color: '#ed8936' }
                  ].map((device, index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      padding: '8px',
                      background: 'white',
                      borderRadius: '4px'
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{device.type}</span>
                      <span style={{
                        background: device.color,
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>{device.count}</span>
                    </div>
                  ))}
                </div>

                {/* Operating Systems */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ marginBottom: '16px', color: '#2d3748' }}>💻 Operating Systems</h4>
                  {Object.entries(
                    visitors.reduce((acc, visit) => {
                      if (visit.device && visit.device.os) {
                        acc[visit.device.os] = (acc[visit.device.os] || 0) + 1;
                      }
                      return acc;
                    }, {})
                  ).map(([os, count], index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      padding: '8px',
                      background: 'white',
                      borderRadius: '4px'
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{os}</span>
                      <span style={{
                        background: '#667eea',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>{count}</span>
                    </div>
                  ))}
                </div>

                {/* Browsers */}
                <div style={{
                  background: '#f8f9fa',
                  padding: '20px',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ marginBottom: '16px', color: '#2d3748' }}>🌐 Browsers</h4>
                  {Object.entries(
                    visitors.reduce((acc, visit) => {
                      if (visit.device && visit.device.browser) {
                        acc[visit.device.browser] = (acc[visit.device.browser] || 0) + 1;
                      }
                      return acc;
                    }, {})
                  ).map(([browser, count], index) => (
                    <div key={index} style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '8px',
                      padding: '8px',
                      background: 'white',
                      borderRadius: '4px'
                    }}>
                      <span style={{ textTransform: 'capitalize' }}>{browser}</span>
                      <span style={{
                        background: '#ed8936',
                        color: 'white',
                        padding: '2px 8px',
                        borderRadius: '12px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'pipedream' && (
            <div>
              <h3 style={{ marginBottom: '24px', color: '#2d3748' }}>Pipedream Integration</h3>
              <div style={{
                background: '#fff3cd',
                padding: '24px',
                borderRadius: '8px',
                border: '1px solid #ffeaa7'
              }}>
                <h4 style={{ marginBottom: '16px', color: '#856404' }}>📋 How to View Cloud Data:</h4>
                <ol style={{ marginBottom: '20px', paddingLeft: '20px', color: '#856404' }}>
                  <li>Go to <a href="https://pipedream.com" target="_blank" style={{ fontWeight: 'bold' }}>pipedream.com</a></li>
                  <li>Navigate to <strong>Workflows</strong> in the menu</li>
                  <li>Click on your <strong>HTTP API</strong> workflow</li>
                  <li>View all entries in <strong>Event History</strong></li>
                </ol>
                <p style={{ color: '#856404', marginBottom: '16px' }}>
                  <strong>Your Pipedream URL:</strong> 
                  <code style={{ 
                    background: '#ffeaa7', 
                    padding: '4px 8px', 
                    borderRadius: '4px',
                    marginLeft: '8px',
                    fontSize: '12px'
                  }}>https://eown3ytayljs38v.m.pipedream.net</code>
                </p>
                <button
                  onClick={() => window.open('https://pipedream.com', '_blank')}
                  style={{
                    background: '#28a745',
                    color: 'white',
                    border: 'none',
                    padding: '12px 24px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🌐 Open Pipedream Dashboard
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;